export interface PubSubStartGameRequest {
  messageId: string;
  liveGameId: string;
}
export interface PubSubStartGameResponse {
  messageId: string;
  gameUrl: string;
}
