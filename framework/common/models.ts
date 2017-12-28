
export type Message = {tickRecieved: number} & ({type: 'ping'} | {type: 'player-join'} | {type: 'pong'});

export type SerializedGameState = {
    players: SerializedPlayerState[];
};
export type SerializedPlayerState = {
    playerId: string;
    avatar: string;
    name: string;
    color: string;
};