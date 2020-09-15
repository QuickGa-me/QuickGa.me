import {ObjectId} from 'bson';
import {HttpPlayerModel} from '../models/httpPlayerModel';
import {HttpGameDetail, HttpGameDetailLight} from '../models/httpGameDetail';
import {GameConfig} from '@common/models/game/gameConfig';
import {GameRules} from './dbGame';

export type DbLiveGameModel = {
  _id: ObjectId;
  gameId: ObjectId;
  lobbyId: ObjectId;
  gameRules: GameRules;
};

export type DbLiveGamePlayerModel = {
  _id: ObjectId;
  liveGameId: ObjectId;
  playerId: ObjectId;
};

export class DbLiveGameLogic {}
