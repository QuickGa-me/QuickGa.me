import {SudokuMessage, SudokuSerializedGameState, SudokuSerializedPlayerState} from '@common/models';
import {QGClient} from '../../../framework/client';

export default class SudokuClient extends QGClient {
    initializeUI(ui: {canvas: HTMLCanvasElement; context: CanvasRenderingContext2D; parent: HTMLDivElement}): void {}

    initializeAssets(): Promise<void> {
        return Promise.resolve();
    }

    initializeState(state: SudokuSerializedGameState): void {
        state.foo = 12;
        state.players = [];
    }

    logicTick(): void {}

    draw(msSinceLastDraw: number): void {}

    receiveMessages(message: SudokuMessage): void {}

    onPlayerJoin(player: SudokuSerializedPlayerState): void {}

    onPlayerLeave(player: SudokuSerializedPlayerState): void {}

    receiveState(state: SudokuSerializedGameState): void {}
}
