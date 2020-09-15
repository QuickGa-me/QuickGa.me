import {UserModel} from '../models/user/userModel';

export type ClientLobbyMessage =
    | {
          type: 'game-ready';
          liveGameId: string;
          gameServerAddress: string;
      }
    | {
          type: 'lobby-update';
          lobby: ClientLobbyUpdateMessage;
      };
export type ClientLobbyUpdateMessage = {
    gameName: string;
    startCountdown: number;
    users: UserModel[];
};

export type ServerLobbyMessage = {
    type: 'join-lobby';
    gameId: string;
};
