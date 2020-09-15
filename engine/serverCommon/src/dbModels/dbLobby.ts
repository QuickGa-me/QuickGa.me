import {ObjectId} from 'bson';
import {HttpPlayerModel} from '../models/httpPlayerModel';
import {HttpGameDetail, HttpGameDetailLight} from '../models/httpGameDetail';
import {GameRules} from './dbGame';
import {HttpLobbyDetails} from '../models/common/httpLobbyDetails';
import {Lobby} from 'quickgame-api/controllers/old/lobbyServer';
import {DbPlayerLogic, DbPlayerModel} from './dbPlayer';

export type DbLobbyModel = {
  _id: ObjectId;
  gameId: ObjectId;
  gameRules: GameRules;
  state: 'created' | 'starting' | 'playing';
  active: boolean;
  public: boolean;
  lobbyCode: string;
};
export type DbLobbyPlayerModel = {
  _id: ObjectId;
  lobbyId: ObjectId;
  voteStart: boolean;
  playerId: ObjectId;
  connectionId: string | undefined;
};

export class DbLobbyLogic {
  static map(lobby: DbLobbyModel): HttpLobbyDetails {
    return {
      gameId: lobby.gameId.toHexString(),
      gameRules: lobby.gameRules,
      lobbyId: lobby._id.toHexString(),
    };
  }

  static mapPlayers(
    players: (DbLobbyPlayerModel & {player: DbPlayerModel})[]
  ): {player: HttpPlayerModel; connected: boolean}[] {
    return players.map((p) => ({
      player: DbPlayerLogic.map(p.player),
      connected: !!p.connectionId,
    }));
  }
}
