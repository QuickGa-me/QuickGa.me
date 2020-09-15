import {ObjectId} from 'bson';
import {HttpPlayerModel} from '../models/httpPlayerModel';
import {HttpGameDetail, HttpGameDetailLight} from '../models/httpGameDetail';
import {GameConfig} from '@common/models/game/gameConfig';

export type DbGameModel = {
  _id: ObjectId;

  gameId: string;
  logo: string;
  name: string;
  description: string;
  author: string;
  gameConfig: GameConfig;

  gameRulesSchema: GameRulesSchema;
  gameRulesDefault: GameRules;
};

export type GameRules = {
  items: {key: string; value: string}[];
};
export type GameRulesSchema = {
  items: {
    key: string;
    option:
      | {type: 'text'; minLength: number; maxLength: number}
      | {type: 'number'; minValue: number; maxValue: number}
      | {type: 'switch'}
      | {type: 'options'; options: {label: string; value: string}[]};
  }[];
};

export class DbGameLogic {
  static mapLight(model: DbGameModel): HttpGameDetailLight {
    return {
      description: model.description,
      id: model.gameId,
      logo: model.logo,
      name: model.name,
    };
  }
  static async mapDetail(model: DbGameModel): Promise<HttpGameDetail> {
    return {
      description: model.description,
      id: model.gameId,
      logo: model.logo,
      name: model.name,
      author: model.author,
      numberOfActivePlayers: 27,
      gameRulesSchema: model.gameRulesSchema,
      gameRulesDefault: model.gameRulesDefault,
    };
  }
}
