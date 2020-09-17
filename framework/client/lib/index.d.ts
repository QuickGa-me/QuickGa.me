import { Message, SerializedGameState, SerializedPlayerState } from 'quickgame-framework-common';
export declare abstract class QGClient {
    abstract initializeUI(ui: {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        parent: HTMLDivElement;
    }): void;
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
