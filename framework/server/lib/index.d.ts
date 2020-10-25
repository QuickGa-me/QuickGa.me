import { Message, SerializedGameState } from '@quickga.me/framework.common';
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
export interface Achievement {
}
declare type Player = {
    connectionId: number;
};
export declare abstract class QGServer<TMessage extends Message> {
    currentTick?: number;
    state?: GameState;
    abstract players: Player[];
    constructor(config: ServerConfig);
    abstract onTick(msSinceLastTick: number): void;
    abstract onStart(): void;
    sendMessageToPlayer(player: Player, message: TMessage): void;
    sendMessageToEveryone(message: TMessage): void;
    awardAchievement(achievement: Achievement): void;
    abstract receiveMessage(connectionId: number, message: TMessage): void;
    abstract onPlayerJoin(connectionId: number): PlayerState;
    abstract onPlayerLeave(connectionId: number): GameState;
    abstract serializeState(): SerializedGameState;
}
export {};
