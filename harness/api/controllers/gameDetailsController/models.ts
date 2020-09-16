import {HttpGameDetail, HttpGameDetailLight} from '@serverCommon/models/httpGameDetail';
import {GameRules} from '@serverCommon/dbModels/dbGame';

export interface GetGamesResponse {
  games: HttpGameDetailLight[];
}

export interface GetGameDetailsRequest {
  gameId: string;
}

export interface JoinLobbyRequest {
  gameId: string;
  rules: GameRules;
}
export interface StartPrivateLobbyRequest {
  gameId: string;
  rules: GameRules;
}
export interface JoinLobbyGameRequest {
  gameId: string;
  lobbyCode: string;
}
export interface JoinLobbyResponse {
  lobbyId: string;
}

export interface GetGameDetailsResponse {
  details: HttpGameDetail;
}
