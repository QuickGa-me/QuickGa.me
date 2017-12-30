import {SudokuGameState, SudokuPlayerState} from './models';
import {SudokuMessage, SudokuSerializedGameState} from '@common/models';
import {QGServer} from '../../../framework/server/index';

export default class SudokuServer extends QGServer {
    onTick(msSinceLastTick: number): void {}

    receiveMessages(message: SudokuMessage): void {}

    onPlayerJoin(): SudokuPlayerState {
        return undefined!;
    }

    onPlayerLeave(): SudokuGameState {
        return undefined!;
    }

    serializeState(): SudokuSerializedGameState {
        return undefined!;
    }
}
