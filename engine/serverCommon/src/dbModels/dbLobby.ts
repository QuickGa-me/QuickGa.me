import {ObjectId} from 'bson';
import {HttpPlayerModel} from '../models/httpPlayerModel';
import {HttpGameDetail, HttpGameDetailLight} from '../models/httpGameDetail';
import {GameRules} from './dbGame';

export type DbLobbyModel = {
  _id: ObjectId;
  gameId: ObjectId;
  gameRules: GameRules;
  active: boolean;
  public: boolean;
  lobbyCode: string;
};
export type DbLobbyPlayerModel = {
  _id: ObjectId;
  lobbyId: ObjectId;
  playerId: ObjectId;
};

export class DbLobbyLogic {
  static mapLight(model: DbLobbyModel): {} {
    return {};
  }
}
