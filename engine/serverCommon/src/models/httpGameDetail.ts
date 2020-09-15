import {GameRules, GameRulesSchema} from '../dbModels/dbGame';

export interface HttpGameDetailLight {
  id: string;
  logo: string;
  name: string;
  description: string;
}
export interface HttpGameDetail {
  id: string;
  logo: string;
  name: string;
  description: string;
  author: string;
  numberOfActivePlayers: number;

  gameRulesSchema: GameRulesSchema;
  gameRulesDefault: GameRules;
}
