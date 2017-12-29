import {GameConfig} from './gameConfig';

export interface GameModel {
    gameName: string;
    gameId: string;
    gameConfig: GameConfig;
}
export interface LiveGameModel {
    gameName: string;
    gameId: string;
    gameConfig: GameConfig;
    clientSource: string;
    gameServerAddress: string;
}
