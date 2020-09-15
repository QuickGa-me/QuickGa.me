import {HttpPlayerModel} from '@serverCommon/models/httpPlayerModel';

export interface GetPlayerDetailsResponse {
  player: HttpPlayerModel;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  player: HttpPlayerModel;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
