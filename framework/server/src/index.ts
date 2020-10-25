import {Message, SerializedGameState} from '@quickga.me/framework.common';

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

type Player = {connectionId: number};

export abstract class QGServer<TMessage extends Message> {
  currentTick?: number;
  state?: GameState;
  abstract players: Player[];

  constructor(config: ServerConfig) {}

  abstract onTick(msSinceLastTick: number): void;
  abstract onStart(): void;

  sendMessageToPlayer(player: Player, message: TMessage): void {
    (this as any).$send(player.connectionId, message);
  }

  sendMessageToEveryone(message: TMessage): void {
    for (const player of this.players) {
      (this as any).$send(player.connectionId, message);
    }
  }

  awardAchievement(achievement: Achievement): void {
    /*todo, verify with server*/
  }

  abstract receiveMessage(connectionId: number, message: TMessage): void;

  abstract onPlayerJoin(connectionId: number): PlayerState;

  abstract onPlayerLeave(connectionId: number): GameState;

  abstract serializeState(): SerializedGameState;
}
