import {SudokuGameState, SudokuPlayerState} from './models';
import {SudokuMessage, SudokuSerializedGameState} from '@common/models';
import {QGServer, ServerConfig} from '../../../framework/server/index';
console.log('hia');

export default class SudokuServer extends QGServer {
    constructor(config: ServerConfig) {
        super(config);
        console.log('haaaaaaaaaaaaasdasdfasdfaasssaasaaaaaaaaai');
    }
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
