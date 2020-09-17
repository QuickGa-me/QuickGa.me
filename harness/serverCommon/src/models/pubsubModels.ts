import {GameRules} from '../dbModels/dbGame';

export interface PubSubNewGameRequest {
  responseId: string;
  messageId: string;
  numberOfPlayers: number;
  gameRules: GameRules;
}
export interface PubSubNewGameResponse {
  messageId: string;
  error?: string;
}
export interface PubSubGameScriptUpdatedRequest {
  messageId: string;
  responseId: string;
}
export interface PubSubGameScriptUpdatedResponse {
  messageId: string;
}
