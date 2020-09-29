import {Collisions, Result} from 'collisions';
import {Entity} from '../baseEntities/entity';
import {ArrayHash} from '../utils/arrayHash';
import {CollisionPair, PhysicsEntity} from '../baseEntities/physicsEntity';
import {TwoVector} from '../utils/twoVector';
import {nextId} from '../utils/uuid';
import {EntityUtils} from '../utils/entityUtils';
import {MathUtils} from '../utils/mathUtils';
import {BaseEntityModels} from '../baseEntities/entityTypes';
const dx = new TwoVector(0, 0);

export abstract class Game<EntityModels extends BaseEntityModels> {
  clientPlayerId?: number;
  collisionEngine: Collisions;
  readonly collisionResult: Result;
  engine!: Engine<EntityModels>;
  entities = new ArrayHash<Entity<EntityModels>>('entityId');
  highestServerStep?: number;
  stepCount: number = 0;
  totalPlayers: number = 0;
  constructor(public isClient: boolean) {
    this.collisionEngine = new Collisions();
    this.collisionResult = this.collisionEngine.createResult();
  }

  addObjectToWorld(entity: Entity<EntityModels>, instantiatedFromSync: boolean = false) {
    if (this.isClient && !instantiatedFromSync && EntityUtils.isShadowEntity(entity)) {
      entity.entityId += 1000000;
      entity.tickCreated = this.stepCount;
    }
    this.engine.assignActor(entity);
    this.entities.push(entity);
  }

  abstract instantiateEntity(messageModel: EntityModels): Entity<EntityModels>;

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

  setEngine(engine: Engine<EntityModels>) {
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
    const collisionPairs: CollisionPair<EntityModels> = {};
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
}

export abstract class Engine<EntityModels extends BaseEntityModels> {
  abstract assignActor(entity: Entity<EntityModels>): void;
  abstract clientDied(): void;
  abstract killPlayer(player: Entity<EntityModels>): void;
  abstract setDebug(key: string, value: number | string): void;
}
