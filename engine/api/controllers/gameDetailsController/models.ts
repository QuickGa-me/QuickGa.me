import {HttpGameDetail, HttpGameDetailLight} from '@serverCommon/models/httpGameDetail';

export interface GetGamesResponse {
  games: HttpGameDetailLight[];
}

export interface GetGameDetailsRequest {
  gameId: string;
}

export interface GetGameDetailsResponse {
  details: HttpGameDetail;
}
