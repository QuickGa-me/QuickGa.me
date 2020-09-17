import {controller, request} from '@serverCommon/utils/decorators';
import {RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {
  GetGameDetailsRequest,
  GetGameDetailsResponse,
  GetGamesResponse,
  JoinLobbyGameRequest,
  JoinLobbyRequest,
  JoinLobbyResponse,
  StartPrivateLobbyRequest,
} from './models';
import {RequestModelValidator} from '../../utils/validation';
import {AuthService} from '@serverCommon/services/authService';
import {ResponseError} from '@serverCommon/utils/responseError';
import {VoidRequest, VoidResponse} from '@serverCommon/models/controller';
import {DbModels} from '@serverCommon/dbModels/dbModels';
import {Aggregator, AggregatorLookup} from '@serverCommon/services/db/typeSafeAggregate';
import {DbLobbyLogic, DbLobbyModel, DbLobbyPlayerModel} from '@serverCommon/dbModels/dbLobby';
import {ObjectId} from 'bson';
import {DbGameLogic} from '@serverCommon/dbModels/dbGame';
import {PubSubService} from '@serverCommon/services/pubSubService';
import {PubSubGameScriptUpdatedRequest, PubSubGameScriptUpdatedResponse} from '@serverCommon/models/pubsubModels';

@controller('game', {})
export class GameController {
  @request('POST', 'server-updated', {statusCodes: []})
  static async serverUpdated(model: VoidRequest, headers: RequestHeaders): Promise<VoidResponse> {
    RequestModelValidator.validateVoidRequest(model);
    console.log('starting');
    await PubSubService.pushAndWait<PubSubGameScriptUpdatedRequest, PubSubGameScriptUpdatedResponse>('game-script', {
      messageId: (Math.random() * 100000000).toFixed(0),
      responseId: PubSubService.id,
    });
    console.log('done');

    return {};
  }
}
ServerRouter.registerClass(GameController);
