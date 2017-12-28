import {GameState, PlayerState, QGServer} from "@framework/index";
import {Message, SerializedGameState} from "@framework-common/models";

export class SudokuServer extends QGServer{
    onTick(msSinceLastTick: number): void {
    }

    receiveMessages(message: Message): void {
    }

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