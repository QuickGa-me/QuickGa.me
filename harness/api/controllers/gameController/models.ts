import {HttpGameDetail, HttpGameDetailLight} from '@serverCommon/models/httpGameDetail';
import {GameRules} from '@serverCommon/dbModels/dbGame';

export interface NewGameRequest {
  numberOfPlayers: number;
  gameRules: GameRules;
}

export interface NewGameResponse {
  error?: string;
}
