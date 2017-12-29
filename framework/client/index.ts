import {Message, SerializedGameState, SerializedPlayerState} from '@framework-common/models';

export abstract class QGClient {
    abstract initializeUI(ui: {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        parent: HTMLDivElement;
    }): void;
    abstract initializeState(state: SerializedGameState): void;

    sendMessage(message: Message): void {
        /*todo*/
    }
    abstract logicTick(): void;
    abstract draw(msSinceLastDraw: number): void;
    get receivedMessages(): Message[] {
        /* todo */ return null!;
    }
    abstract receiveMessages(message: Message): void;

    abstract onPlayerJoin(player: SerializedPlayerState): void;
    abstract onPlayerLeave(player: SerializedPlayerState): void;
    abstract receiveState(state: SerializedGameState): void;
}
