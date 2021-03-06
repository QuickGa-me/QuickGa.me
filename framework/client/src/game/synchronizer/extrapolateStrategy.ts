import {Sync, SyncStrategy} from './syncStrategy';
import {ClientEngine} from '../clientEngine';
import {
  assertType,
  Entity,
  EntityUtils,
  PhysicsEntity,
  PhysicsEntityModel,
  Utils,
} from '@quickga.me/framework.common';

const defaults = {
  syncsBufferLength: 5,
  maxReEnactSteps: 60, // maximum number of steps to re-enact
  extrapolate: 2, // player performs method "X" which means extrapolate to match server time. that 100 + (0..100)
  localObjBending: 0.1, // amount of bending towards position of sync object
  remoteObjBending: 0.6, // amount of bending towards position of sync object
  bendingIncrements: 10, // the bending should be applied increments (how many steps for entire bend)
};

export class ExtrapolateStrategy extends SyncStrategy {
  options: typeof defaults;
  STEP_DRIFT_THRESHOLDS = {
    onServerSync: {MAX_LEAD: 2, MAX_LAG: 3}, // max step lead/lag allowed after every server sync
    onEveryStep: {MAX_LEAD: 7, MAX_LAG: 4}, // max step lead/lag allowed at every step
    clientReset: 40, // if we are behind this many steps, just reset the step counter
  };

  private readonly recentInputs: {[stepNumber: number]: CTOSPlayerInput};
  constructor(clientEngine: ClientEngine, options?: typeof defaults) {
    super(clientEngine);
    this.options = {...defaults, ...options};

    this.recentInputs = {};
  }

  // apply a new sync
  applySync(sync: Sync): 'SYNC_APPLIED' | null {
    // if sync is in the future, we are not ready to apply yet.
    if (sync.stepCount > this.gameEngine.stepCount) {
      return null;
    }
    const game = this.gameEngine;

    // console.debug('extrapolate applying sync');

    //
    //    scan all the objects in the sync
    //
    // 1. if the object has a local shadow, adopt the server object,
    //    and destroy the shadow
    //
    // 2. if the object exists locally, sync to the server object,
    //    later we will re-enact the missing steps and then bend to
    //    the current position
    //
    // 3. if the object is new, just create it
    //
    let serverStep = sync.stepCount;

    const entityMap = Utils.toDictionary(sync.entities, (a) => a.entityId);
    for (let i = this.gameEngine.entities.length - 1; i >= 0; i--) {
      const entity = this.gameEngine.entities.getIndex(i);
      if (EntityUtils.isShadow(entity)) continue;
      assertType<Entity>(entity);
      if (entity.actor?.clientDestroyedTick !== undefined) {
        entity.actor.clientDestroyedTick--;
        if (entity.actor.clientDestroyedTick <= 0) {
          entity.actor.clientDestroyedTick = undefined;
        }
      }
      if (entityMap[entity.entityId]) {
        continue;
      }
      entity.destroy();
      this.gameEngine.entities.remove(entity);
    }

    for (const messageModel of sync.entities) {
      const foundEntityShadow =
        'inputId' in messageModel &&
        this.gameEngine.entities.array.find(
          (entity) => EntityUtils.isShadow(entity) && entity.inputId === messageModel.inputId
        );

      if (foundEntityShadow && EntityUtils.isShadow(foundEntityShadow)) {
        // case 1: this object has a local shadow object on the client
        console.debug(
          `object ${messageModel.entityId} replacing local shadow ${foundEntityShadow.entityId} ${foundEntityShadow.inputId}`
        );
        if (!this.gameEngine.entities.lookup(messageModel.entityId)) {
          const newObj = this.addNewObject(messageModel);
          if (newObj instanceof PhysicsEntity) {
            newObj.saveState(foundEntityShadow.serialize() as PhysicsEntityModel);
          }
        }
        this.gameEngine.entities.remove(foundEntityShadow);
      } else {
        let foundEntity = this.gameEngine.entities.lookup(messageModel.entityId);
        if (!foundEntity) {
          foundEntity = this.addNewObject(messageModel);
        } else {
          /*console.info(`object before syncTo: ${JSON.stringify(foundEntity.serialize())}`);*/
          if (foundEntity instanceof PhysicsEntity) {
            foundEntity.saveState();
          }
          foundEntity.reconcileFromServer(messageModel);
          /*
          console.info(
            `object after syncTo: ${JSON.stringify(foundEntity.serialize())} synced to step[${sync.stepCount}]`
          );
*/
        }
      }
    }

    const shadows = this.gameEngine.entities.array.filter((a) => EntityUtils.isShadow(a));

    if (shadows.length > 0) {
      /*
      console.log(
        'a',
        sync.entities.filter((a) => 'inputId' in a).map((a) => (a as any).inputId)
      );
      console.log(
        'b',
        shadows.map((a) => EntityUtils.isShadowEntity(a) && (a as any).inputId + ' ' + a.tickCreated)
      );*/
      for (const shadow of shadows) {
        if (EntityUtils.isShadowEntity(shadow)) {
          if (shadow.tickCreated + 60 < this.gameEngine.stepCount) {
            this.gameEngine.entities.remove(shadow);
            console.log('Removed bad shadow');
          }
        }
      }
    }

    //
    // reenact the steps that we want to extrapolate forwards
    //
    // console.debug(`extrapolate re-enacting steps from [${serverStep}] to [${game.stepCount}]`);
    if (serverStep < game.stepCount - this.options.maxReEnactSteps) {
      serverStep = game.stepCount - this.options.maxReEnactSteps;
      console.info(`too many steps to re-enact.  Starting from [${serverStep}] to [${game.stepCount}]`);
    }

    const clientStep = game.stepCount;
    for (game.stepCount = serverStep; game.stepCount < clientStep; ) {
      if (this.recentInputs[game.stepCount]?.movement) {
        const inputDesc = this.recentInputs[game.stepCount];
        console.info(`extrapolate re-enacting movement input[${inputDesc.messageIndex}]`);
        this.gameEngine.processInput(inputDesc, this.gameEngine.clientPlayerId!);
      }

      // run the game engine step in "reenact" mode
      this.gameEngine.step(true);
    }
    this.cleanRecentInputs(serverStep);

    //
    // bend back to original state
    //
    for (const entity of this.gameEngine.entities.array) {
      // shadow objects are not bent
      if (EntityUtils.isShadow(entity)) continue;
      if (entity instanceof PhysicsEntity) {
        const isLocal = entity.owningPlayerId === this.gameEngine.clientPlayerId; // eslint-disable-line eqeqeq
        const bending = isLocal ? this.options.localObjBending : this.options.remoteObjBending;
        entity.bendToCurrentState(bending, isLocal, this.options.bendingIncrements);

        const bendingString = entity.bendingIncrements
          ? `ΔPos=${entity.bendingPositionDelta} ΔVel=${entity.bendingVelocityDelta} ΔAngle=${entity.bendingAngleDelta} increments=${entity.bendingIncrements}`
          : 'no bending';

        // console.info(`object[${entity.entityId}] ${bendingString}`);
      }
    }

    return 'SYNC_APPLIED';
  }

  // clean up the input buffer
  cleanRecentInputs(lastServerStep: number) {
    for (const input of Utils.safeKeys(this.recentInputs)) {
      if (input <= lastServerStep) {
        delete this.recentInputs[input];
      }
    }
  }

  // keep a buffer of inputs so that we can replay them on extrapolation
  clientInputSave(inputEvent: CTOSPlayerInput) {
    this.recentInputs[inputEvent.step] = inputEvent;
  }
}
