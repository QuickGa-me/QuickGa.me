export type ClientGameMessage = {type: 'game-starting'} | {type: 'user-authorized'};

export type ServerGameMessage = {
    type: 'join-game';
    gameId: string;
};
