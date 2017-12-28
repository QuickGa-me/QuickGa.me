import {QGClient} from "@framework/index";
import {Message, SerializedGameState, SerializedPlayerState} from "@framework-common/models";

export class SudokuClient extends QGClient{
    initializeUI(ui: { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D; parent: HTMLDivElement }): void {
    }

    initializeState(state: SerializedGameState): void {
    }

    logicTick(): void {
    }

    draw(msSinceLastDraw: number): void {
    }

    receiveMessages(message: Message): void {
    }

    onPlayerJoin(player: SerializedPlayerState): void {
    }

    onPlayerLeave(player: SerializedPlayerState): void {
    }

    receiveState(state: SerializedGameState): void {
    }

}