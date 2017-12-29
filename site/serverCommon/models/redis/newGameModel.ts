import {WaitMessage} from '../../pubSub';

export interface NewGameRequest extends WaitMessage {
    liveGameId: string;
    lobbyId: string;
}

export interface NewGameResponse extends WaitMessage {
    liveGameId: string;
    gameServerAddress: string;
}
