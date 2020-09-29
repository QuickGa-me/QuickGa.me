import {Message, SerializedGameState} from 'quickgame-framework-common';

export type GameState = {
  currentTick: number;
  players: PlayerState[];
};

export type PlayerState = {
  playerId: string;
  avatar: string;
  name: string;
  color: string;
};

export interface ServerConfig {
  logicTickInterval: -1 | 100;
}

export interface Achievement {}

export abstract class QGServer {
  currentTick?: number;
  state?: GameState;

  constructor(config: ServerConfig) {}

  abstract onTick(msSinceLastTick: number): void;

  sendMessageToPlayer(playerId: string, message: Message): void {
    /*todo*/
  }

  sendMessageToEveryone(message: Message): void {
    /*todo*/
  }

  awardAchievement(achievement: Achievement): void {
    /*todo, verify with server*/
  }

  get receivedMessages(): Message[] {
    /* todo */
    return null!;
  }

  abstract receiveMessages(message: Message): void;

  abstract onPlayerJoin(): PlayerState;

  abstract onPlayerLeave(): GameState;

  abstract serializeState(): SerializedGameState;
}
