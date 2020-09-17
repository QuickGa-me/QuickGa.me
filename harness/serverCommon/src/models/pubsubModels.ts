export interface PubSubStartGameRequest {
  messageId: string;
  liveGameId: string;
}
export interface PubSubStartGameResponse {
  messageId: string;
  gameUrl: string;
}
export interface PubSubGameScriptUpdatedRequest {
  messageId: string;
  responseId: string;
}
export interface PubSubGameScriptUpdatedResponse {
  messageId: string;
}
