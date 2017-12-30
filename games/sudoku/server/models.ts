import {GameState, PlayerState} from '../../../framework/server/index';

export interface SudokuGameState extends GameState {
    players: SudokuPlayerState[];
    foo: 12;
}

export interface SudokuPlayerState extends PlayerState {
    bar: 13;
}
