import {GameConfig} from '../game/gameConfig';

export interface GameModel {
    gameName: string;
    gameId: string;
    gameConfig: GameConfig;
}

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
