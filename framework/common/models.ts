export type Message = {};

export interface SerializedGameState {
  players: SerializedPlayerState[];
}

export interface SerializedPlayerState {
  playerId: string;
  avatar: string;
  name: string;
  color: string;
}
