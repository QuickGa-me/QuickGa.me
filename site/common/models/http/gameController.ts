import {GameConfig} from '../game/gameConfig';
import {GameModel} from "../game/gameModel";


export interface GetAllGamesResponse {
    games: GameModel[];
}
export interface GetGameResponse {
    game: GameModel;
}

export interface CreateGameRequest {
    gameName: string;
}

export interface CreateGameResponse {
    gameId?: string;
}

export interface UpdateGameRequest {
    serverSource: string;
    clientSource: string;
    gameConfig: GameConfig;
}
