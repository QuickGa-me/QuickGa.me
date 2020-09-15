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
import {PlayerJoinResponse, PlayerJoinRequest} from './models';
import {AuthService} from '@serverCommon/services/authService';

@controller('lobbySocket')
export class LobbySocketController {
  static async connectionManagement(event: WebsocketRequestEvent<any>): Promise<VoidResponse> {
    if (event.requestContext.eventType === 'CONNECT') {
      console.log('connect');
      const player = await AuthService.validatePlayerToken(event.params.jwt);
      console.log('updated');
      return {};
    } else if (event.requestContext.eventType === 'DISCONNECT') {
      console.log('disconnecting', event.requestContext.connectionId);
      await this.playerLeave();
      return {};
    }
    return {};
  }

  @websocketEvent('playerJoin')
  static async sendPlayerJoin(
    channel: {socketConnectionId?: string},
    message: WebSocketResponse<PlayerJoinResponse>
  ): Promise<void> {
    if (channel.socketConnectionId) {
      try {
        await SocketService.publish(channel.socketConnectionId, {
          event: 'playerJoin',
          data: message.data,
        });
      } catch (ex) {
        if (ex.statusCode === 410) {
          await this.playerLeave();
        } else {
          console.error(ex);
        }
      }
    }
  }

  @websocketRequest('playerJoin')
  static async playerJoin(requestEvent: WebsocketRequestEvent<PlayerJoinRequest>): Promise<number> {
    return 200;
  }

  private static async playerLeave() {
    //
  }
}

ServerRouter.registerClass(LobbySocketController);
