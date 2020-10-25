import {SDSimpleObject} from '../schemaDefiner';
import {ClientActor} from './clientActor';
import {Engine, Game} from '../game';

export abstract class Entity {
  actor?: ClientActor<this>;
  entityId: number;
  markToDestroy: boolean = false;
  owningPlayerId?: number;
  abstract type: unknown;
  constructor(public game: Game<any, any, any, any>, messageModel: EntityModel) {
    this.entityId = messageModel.entityId;
  }

  destroy() {
    this.markToDestroy = true;
  }

  abstract gameTick(duration: number): void;

  inView(viewX: number, viewY: number, viewWidth: number, viewHeight: number, playerId: number): boolean {
    return true;
  }

  postTick() {}

  reconcileFromServer(messageModel: EntityModel) {
    this.actor?.reconcileFromServer(messageModel);
    this.entityId = messageModel.entityId;
  }

  serialize(): EntityModel {
    return {
      entityId: this.entityId,
    };
  }

  killEntity() {}
}

export type EntityModel = {
  entityId: number;
};

export const EntityModelSchema: SDSimpleObject<EntityModel> = {
  entityId: 'uint32',
};
