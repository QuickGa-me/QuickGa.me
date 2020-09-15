import {ServerRouter} from '../serverRouter';
import {
  controller,
  websocketEvent,
  websocketRequest,
  WebsocketRequestEvent,
  WebSocketResponse,
} from '@serverCommon/utils/decorators';
import {VoidResponse} from '@serverCommon/models/controller';
import {SocketService} from '@serverCommon/services/socketService';
import {PlayerJoinRequest, LobbyDetailsResponse, LobbyPlayersResponse} from './models';
import {AuthService} from '@serverCommon/services/authService';
import {DbModels} from '@serverCommon/dbModels/dbModels';
import {ResponseError} from '@serverCommon/utils/responseError';
import {DbLobbyLogic, DbLobbyModel, DbLobbyPlayerModel} from '@serverCommon/dbModels/dbLobby';
import {Aggregator, AggregatorLookup} from '@serverCommon/services/db/typeSafeAggregate';
import {DbPlayerModel} from '@serverCommon/dbModels/dbPlayer';

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
}

ServerRouter.registerClass(LobbySocketController);
