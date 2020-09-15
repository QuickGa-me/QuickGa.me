import {ServerRouter} from '../serverRouter';
import {
  controller,
  websocketEvent,
  websocketRequest,
  WebsocketRequestEvent,
  WebSocketResponse,
} from '@serverCommon/utils/decorators';
import {VoidRequest, VoidResponse} from '@serverCommon/models/controller';
import {SocketService} from '@serverCommon/services/socketService';
import {
  PlayerJoinRequest,
  LobbyDetailsResponse,
  LobbyPlayersResponse,
  LobbyVoteStartResponse,
  VoteStartRequest,
  GameStartedResponse,
} from './models';
import {AuthService} from '@serverCommon/services/authService';
import {DbModels} from '@serverCommon/dbModels/dbModels';
import {ResponseError} from '@serverCommon/utils/responseError';
import {DbLobbyLogic, DbLobbyModel, DbLobbyPlayerModel} from '@serverCommon/dbModels/dbLobby';
import {Aggregator, AggregatorLookup} from '@serverCommon/services/db/typeSafeAggregate';
import {DbPlayerModel} from '@serverCommon/dbModels/dbPlayer';
import {ObjectId} from 'bson';
import {DbGameModel} from '@serverCommon/dbModels/dbGame';
import {PubSubService} from '@serverCommon/services/pubSubService';
import {Utils} from '@common/utils';
import {PubSubStartGameRequest, PubSubStartGameResponse} from '@serverCommon/models/pubsubModels';

@controller('lobbySocket')
export class LobbySocketController {
  @websocketRequest('$connect')
  @websocketRequest('$disconnect')
  static async connectionManagement(requestEvent: WebsocketRequestEvent<any>): Promise<VoidResponse> {
    if (requestEvent.requestContext.eventType === 'CONNECT') {
      console.log('connect');
      console.log('updated');
      return {};
    } else if (requestEvent.requestContext.eventType === 'DISCONNECT') {
      await this.playerLeave(requestEvent.requestContext.connectionId);
      return {};
    }
    return {};
  }

  @websocketEvent('lobbyPlayers')
  static async sendLobbyPlayers(
    channel: {socketConnectionId?: string},
    message: WebSocketResponse<LobbyPlayersResponse>
  ): Promise<void> {
    if (channel.socketConnectionId) {
      try {
        await SocketService.publish(channel.socketConnectionId, {
          event: 'lobbyPlayers',
          data: message.data,
        });
      } catch (ex) {
        if (ex.statusCode === 410) {
          await this.playerLeave(channel.socketConnectionId);
        } else {
          console.error(ex);
        }
      }
    }
  }
  @websocketEvent('gameStarting')
  static async gameStarting(
    channel: {socketConnectionId?: string},
    message: WebSocketResponse<VoidResponse>
  ): Promise<void> {
    if (channel.socketConnectionId) {
      try {
        await SocketService.publish(channel.socketConnectionId, {
          event: 'gameStarting',
          data: message.data,
        });
      } catch (ex) {
        if (ex.statusCode === 410) {
          await this.playerLeave(channel.socketConnectionId);
        } else {
          console.error(ex);
        }
      }
    }
  }
  @websocketEvent('gameStarted')
  static async gameStarted(
    channel: {socketConnectionId?: string},
    message: WebSocketResponse<GameStartedResponse>
  ): Promise<void> {
    if (channel.socketConnectionId) {
      try {
        await SocketService.publish(channel.socketConnectionId, {
          event: 'gameStarted',
          data: message.data,
        });
      } catch (ex) {
        if (ex.statusCode === 410) {
          await this.playerLeave(channel.socketConnectionId);
        } else {
          console.error(ex);
        }
      }
    }
  }
  @websocketEvent('voteStart')
  static async sendVoteStart(
    channel: {socketConnectionId?: string},
    message: WebSocketResponse<LobbyVoteStartResponse>
  ): Promise<void> {
    if (channel.socketConnectionId) {
      try {
        await SocketService.publish(channel.socketConnectionId, {
          event: 'voteStart',
          data: message.data,
        });
      } catch (ex) {
        if (ex.statusCode === 410) {
          await this.playerLeave(channel.socketConnectionId);
        } else {
          console.error(ex);
        }
      }
    }
  }

  @websocketEvent('lobbyDetails')
  static async sendLobbyDetails(
    channel: {socketConnectionId?: string},
    message: WebSocketResponse<LobbyDetailsResponse>
  ): Promise<void> {
    if (channel.socketConnectionId) {
      try {
        await SocketService.publish(channel.socketConnectionId, {
          event: 'lobbyDetails',
          data: message.data,
        });
      } catch (ex) {
        if (ex.statusCode === 410) {
          await this.playerLeave(channel.socketConnectionId);
        } else {
          console.error(ex);
        }
      }
    }
  }

  @websocketRequest('join')
  static async join(requestEvent: WebsocketRequestEvent<PlayerJoinRequest>): Promise<number> {
    const player = await AuthService.validatePlayerToken(requestEvent.params.jwt);
    if (!player) {
      throw new ResponseError(401, '');
    }
    const lobbyPlayer = await DbModels.lobbyPlayer.getOne({playerId: player.playerId});
    if (!lobbyPlayer) throw new ResponseError(400, 'Sorry, you are not part of this lobby');
    await DbModels.lobbyPlayer.updateOne(
      {_id: lobbyPlayer._id},
      {$set: {connectionId: requestEvent.requestContext.connectionId}}
    );

    const lobby = await DbModels.lobby.getById(lobbyPlayer.lobbyId);
    if (!lobby) throw new ResponseError(400, 'Sorry, you are not part of this lobby');

    await this.sendLobbyDetails(
      {socketConnectionId: requestEvent.requestContext.connectionId},
      {data: {lobby: DbLobbyLogic.map(lobby)}}
    );

    await this.blastPlayers(lobby);
    return 200;
  }

  @websocketRequest('voteStart')
  static async voteStart(requestEvent: WebsocketRequestEvent<VoteStartRequest>): Promise<number> {
    const player = await AuthService.validatePlayerToken(requestEvent.params.jwt);
    if (!player) {
      throw new ResponseError(401, '');
    }
    const lobbyPlayer = await DbModels.lobbyPlayer.getOne({playerId: player.playerId});
    if (!lobbyPlayer) throw new ResponseError(400, 'Sorry, you are not part of this lobby');
    const lobby = await DbModels.lobby.getById(lobbyPlayer.lobbyId);
    if (!lobby) throw new ResponseError(400, "Sorry, this lobby doesn't exist");
    const game = await DbModels.game.getById(lobby.gameId);
    if (!game) throw new ResponseError(400, "Sorry, this lobby doesn't exist");
    if (
      game.gameConfig.lobbyRules.minPlayers <
      (await DbModels.lobbyPlayer.count({lobbyId: lobby._id, connectionId: {$ne: undefined}}))
    ) {
      throw new ResponseError(400, 'There are not enough players to vote!');
    }
    await DbModels.lobbyPlayer.updateOne(
      {_id: lobbyPlayer._id},
      {$set: {voteStart: requestEvent.params.data.voteStart}}
    );

    const full = await this.blastVoteStart(lobby);
    if (full) {
      await this.startGame(lobby, game);
    }
    return 200;
  }

  private static async playerLeave(connectionId: string) {
    const lobbyPlayer = await DbModels.lobbyPlayer.getOne({connectionId});
    await DbModels.lobbyPlayer.deleteOne({connectionId});
    if (lobbyPlayer) {
      const lobby = await DbModels.lobby.getById(lobbyPlayer.lobbyId);
      if (lobby) {
        await this.blastPlayers(lobby);
      }
    }
  }

  private static async blastPlayers(lobby: DbLobbyModel) {
    const players = await Aggregator.start<DbLobbyPlayerModel>()
      .$match({
        lobbyId: lobby._id,
      })
      .$lookupCallback((agg, aggLookup: AggregatorLookup<DbPlayerModel>) => ({
        from: DbModels.player.collectionName,
        localField: agg.key((a) => a.playerId),
        foreignField: aggLookup.key((a) => a._id),
        as: 'player',
      }))
      .$unwind('player')
      .result(await DbModels.lobbyPlayer.getCollection());

    for (const player of players) {
      if (player.connectionId) {
        await this.sendLobbyPlayers(
          {socketConnectionId: player.connectionId},
          {data: {players: DbLobbyLogic.mapPlayers(players)}}
        );
      }
    }
  }

  private static async blastVoteStart(lobby: DbLobbyModel) {
    const players = await DbModels.lobbyPlayer.getAllProject({lobbyId: lobby._id}, {connectionId: 1, voteStart: 1});

    for (const player of players) {
      if (player.connectionId) {
        await this.sendVoteStart(
          {socketConnectionId: player.connectionId},
          {
            data: {
              votes: {
                start: players.filter((a) => a.voteStart).length,
                notStart: players.filter((a) => !a.voteStart).length,
              },
            },
          }
        );
      }
    }
    if (players.filter((a) => a.voteStart).length === players.length) {
      return true;
    }
    return false;
  }

  private static async startGame(lobby: DbLobbyModel, game: DbGameModel) {
    await DbModels.lobby.updateOne(
      {_id: lobby._id},
      {
        $set: {
          active: false,
          state: 'starting',
        },
      }
    );
    const players = await DbModels.lobbyPlayer.getAllProject({lobbyId: lobby._id}, {playerId: 1, connectionId: 1});
    for (const player of players) {
      if (player.connectionId) {
        await this.gameStarting({socketConnectionId: player.connectionId}, {data: {}});
      }
    }
    const liveGame = await DbModels.liveGame.insertDocument({
      gameId: game._id,
      gameRules: lobby.gameRules,
      lobbyId: lobby._id,
    });
    await DbModels.liveGamePlayer.insertDocuments(
      players.map((p) => ({
        liveGameId: liveGame._id,
        playerId: p.playerId,
      }))
    );

    const newGameResponse = await PubSubService.pushAndWait<PubSubStartGameRequest, PubSubStartGameResponse>(
      'new-game',
      {
        messageId: Utils.guid(),
        liveGameId: liveGame._id.toHexString(),
      }
    );

    for (const player of players) {
      if (player.connectionId) {
        await this.gameStarted({socketConnectionId: player.connectionId}, {data: {gameUrl: newGameResponse.gameUrl}});
        await SocketService.disconnect(player.connectionId);
      }
    }
  }
}

ServerRouter.registerClass(LobbySocketController);
