import {ObjectId} from 'bson';
import {HttpPlayerModel} from '../models/httpPlayerModel';

export type DbPlayerModel = {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  anon: boolean;
};

export class DbPlayerLogic {
  static map(playerModel: DbPlayerModel): HttpPlayerModel {
    return {
      playerId: playerModel._id.toHexString(),
      name: playerModel.name,
      email: playerModel.email,
      anon: playerModel.anon,
    };
  }
}
