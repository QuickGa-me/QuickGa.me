import {GameState, PlayerState, QGServer} from '../../../framework/server/index';
import {Message, SerializedGameState} from '@framework-common/models';

export default class SudokuServer extends QGServer {
    onTick(msSinceLastTick: number): void {}

    receiveMessages(message: Message): void {}

    onPlayerJoin(): PlayerState {
        return undefined!;
    }

    onPlayerLeave(): GameState {
        return undefined!;
    }

    serializeState(): SerializedGameState {
        return undefined!;
    }
}
