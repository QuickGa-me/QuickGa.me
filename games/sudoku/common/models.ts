import {Message, SerializedGameState, SerializedPlayerState} from '../../../framework/common/models';

export interface SudokuSerializedGameState extends SerializedGameState {
    players: SudokuSerializedPlayerState[];
    foo: 12;
}

export interface SudokuSerializedPlayerState extends SerializedPlayerState {
    bar: 13;
}

export type SudokuMessage = Message & {
    type: 'player-joined';
};
