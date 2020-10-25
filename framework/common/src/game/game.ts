import {Collisions, Result} from 'collisions';
import {BaseEntityModel, BaseEntityModels, Entity} from '../baseEntities';
import {ArrayHash} from '../utils';
import {CollisionPair, PhysicsEntity} from '../baseEntities';
import {TwoVector} from '../utils';
import {EntityUtils} from '../utils';
import {MathUtils} from '../utils';

const dx = new TwoVector(0, 0);

type GameConfig = {screenSize: {width: number; height: number}};

export abstract class Game<
  STOC extends {type: string},
  CTOS extends {type: string},
  PlayerInputKeys extends string,
  EngineConfig extends BaseEngineConfig<STOC, CTOS, PlayerInputKeys>
> {
  gameConfig: GameConfig;
  clientPlayerId?: number;
  collisionEngine: Collisions;
  readonly collisionResult: Result;
  engine!: Engine<STOC, CTOS, PlayerInputKeys, EngineConfig>;
  entities = new ArrayHash<Entity>('entityId');
  highestServerStep?: number;
  stepCount: number = 0;
  totalPlayers: number = 0;
  constructor(public isClient: boolean, gameConfig: GameConfig) {
    this.gameConfig = gameConfig;
    this.collisionEngine = new Collisions();
    this.collisionResult = this.collisionEngine.createResult();
  }

  addObjectToWorld(entity: Entity, instantiatedFromSync: boolean = false) {
    if (this.isClient && !instantiatedFromSync && EntityUtils.isShadowEntity(entity)) {
      entity.entityId += 1000000;
      entity.tickCreated = this.stepCount;
    }
    this.engine.assignActor(entity);
    this.entities.push(entity);
  }

  abstract instantiateEntity(messageModel: BaseEntityModel): Entity;

  physicsStep(isReenact: boolean, dt?: number) {
    dt = dt ?? 1;
    for (const entity of this.entities.array) {
      // skip physics for shadow objects during re-enactment
      if (isReenact && EntityUtils.isShadow(entity)) {
        continue;
      }
      if (entity instanceof PhysicsEntity) {
        // physics
        const velMagnitude = entity.velocity.length();
        if (entity.maxSpeed && velMagnitude > entity.maxSpeed) {
          entity.velocity.multiplyScalar(entity.maxSpeed / velMagnitude);
        }
        dx.copy(entity.velocity).multiplyScalar(dt);
        entity.position.add(dx);

        entity.velocity.multiply(entity.friction);

        entity.updatePolygon();
      }
    }

    this.checkCollisions();
  }

  abstract postTick(tickIndex: number, duration: number): void;
  /*
  processInput(inputDesc: CTOSPlayerInput, playerId: number) {
    this.entities.lookup(playerId)?.applyInput(inputDesc);
  }*/

  setEngine(engine: Engine<STOC, CTOS, PlayerInputKeys, EngineConfig>) {
    this.engine = engine;
  }

  step(isReenact: boolean, dt?: number, physicsOnly?: boolean): void {
    if (physicsOnly) {
      if (dt) dt /= 1000; // physics engines work in seconds
      this.physicsStep(isReenact, dt);
      return;
    }

    const step = ++this.stepCount;

    if (dt) dt /= 1000; // physics engines work in seconds
    this.physicsStep(isReenact, dt);

    /*
    if (!isReenact) {
      this.timer.tick();
    }
*/
  }

  protected checkCollisions() {
    this.collisionEngine.update();
    const collisionPairs: CollisionPair = {};
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities.getIndex(i);
      if (entity instanceof PhysicsEntity) {
        entity.checkCollisions(collisionPairs);
      }
    }
    for (const collisionKey in collisionPairs) {
      const {entity1, entity2, collisionResult} = collisionPairs[collisionKey];

      entity1.collide(entity2, collisionResult);
      entity2.collide(entity1, collisionResult);

      MathUtils.resolveCollision(entity1, entity2);
    }
  }

  abstract processInput(inputDesc: CTOSPlayerInput<PlayerInputKeys>, playerId: number): void;
}

type CTOSJoin = {type: 'join'};
type CTOSPing = {ping: number; type: 'ping'};
export type CTOSPlayerInput<PlayerInputKeys extends string> = {
  keys: {[key in PlayerInputKeys]: boolean};
  messageIndex: number;
  step: number;
  type: 'playerInput';
};

type STOCJoined = {
  playerEntityId: number;
  serverVersion: number;
  stepCount: number;
  type: 'joined';
};
type STOCPong = {type: 'pong'; ping: number};

export type BaseEngineConfig<
  STOC extends {type: string},
  CTOS extends {type: string},
  PlayerInputKeys extends string
> = {
  ServerToClientMessage: STOC | STOCJoined | STOCPong;
  ClientToServerMessage: CTOS | CTOSJoin | CTOSPing | CTOSPlayerInput<PlayerInputKeys>;
  PlayerInputKeys: PlayerInputKeys;
};

export abstract class Engine<
  STOC extends {type: string},
  CTOS extends {type: string},
  PlayerInputKeys extends string,
  EngineConfig extends BaseEngineConfig<STOC, CTOS, PlayerInputKeys>
> {
  abstract assignActor(entity: Entity): void;
  abstract setDebug(key: string, value: number | string): void;
}
