import { Message, SerializedGameState, SerializedPlayerState } from '@quickga.me/framework.common';
export * from './socket';
export * from './game';
export declare abstract class QGClient {
    abstract render(): any;
    abstract initializeState(state: SerializedGameState): void;
    abstract initializeAssets(): Promise<void>;
    sendMessage(message: Message): void;
    abstract logicTick(): void;
    abstract draw(msSinceLastDraw: number): void;
    get receivedMessages(): Message[];
    abstract receiveMessages(message: Message): void;
    abstract onPlayerJoin(player: SerializedPlayerState): void;
    abstract onPlayerLeave(player: SerializedPlayerState): void;
    abstract receiveState(state: SerializedGameState): void;
}
