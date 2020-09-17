import {Message, SerializedGameState} from 'quickgame-framework-common';
export declare type GameState = {
  currentTick: number;
  players: PlayerState[];
};
export declare type PlayerState = {
  playerId: string;
  avatar: string;
  name: string;
  color: string;
};
export interface ServerConfig {
  logicTickInterval: -1 | 100;
}
export interface Achievement {}
export declare abstract class QGServer {
  currentTick?: number;
  state?: GameState;
  constructor(config: ServerConfig);
  abstract onTick(msSinceLastTick: number): void;
  sendMessageToPlayer(playerId: string, message: Message): void;
  sendMessageToEveryone(message: Message): void;
  awardAchievement(achievement: Achievement): void;
  get receivedMessages(): Message[];
  abstract receiveMessages(message: Message): void;
  abstract onPlayerJoin(): PlayerState;
  abstract onPlayerLeave(): GameState;
  abstract serializeState(): SerializedGameState;
}
