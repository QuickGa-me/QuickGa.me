import {GameConfig} from './gameConfig';

export interface GameModel {
    gameName: string;
    gameId: string;
    gameConfig: GameConfig;
}
