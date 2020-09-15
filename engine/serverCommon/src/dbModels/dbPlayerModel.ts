import {ObjectId} from 'bson';
import {HttpPlayerModel} from '../models/httpPlayerModel';

export type DbPlayerModel = {
  _id: ObjectId;
  name: string;
};

export class DbPlayerLogic {
  static map(playerModel: DbPlayerModel): HttpPlayerModel {
    return {
      playerId: playerModel._id.toHexString(),
      name: playerModel.name,
    };
  }
}
