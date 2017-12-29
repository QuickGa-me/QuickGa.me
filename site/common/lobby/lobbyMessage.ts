export type ClientLobbyMessage =
    | {
          type: 'game-ready';
      }
    | {
          type: 'lobby-update';
          lobby: ClientLobbyUpdateMessage;
      };
export type ClientLobbyUpdateMessage = {
    gameName: string;
    startCountdown: number;
    players: {playerId: string; avatar: string; name: string; color: string}[];
};

export type ServerLobbyMessage = {
    type: 'join-lobby';
    gameId: string;
};
