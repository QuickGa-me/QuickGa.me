import {HttpLobbyDetails} from '@serverCommon/models/common/httpLobbyDetails';
import {HttpPlayerModel} from '@serverCommon/models/httpPlayerModel';

export interface LobbyDetailsResponse {
  lobby: HttpLobbyDetails;
}
export interface LobbyPlayersResponse {
  players: {player: HttpPlayerModel; connected: boolean}[];
}
export interface GameStartedResponse {
  gameUrl: string;
}
export interface LobbyVoteStartResponse {
  votes: {start: number; notStart: number};
}
export interface PlayerJoinRequest {
  playerId: string;
}

export interface VoteStartRequest {
  voteStart: boolean;
}
