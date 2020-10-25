import {controller, request} from '@serverCommon/utils/decorators';
import {RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {NewGameRequest, NewGameResponse} from './models';
import {RequestModelValidator} from '../../utils/validation';
import {VoidRequest, VoidResponse} from '@serverCommon/models/controller';
import {
  PubSubGameScriptUpdatedRequest,
  PubSubGameScriptUpdatedResponse,
  PubSubNewGameRequest,
  PubSubNewGameResponse,
} from '@serverCommon/models/pubsubModels';
import {PubSubGameScript, PubSubNewGame} from '../../services/pubSubGameScript';

@controller('game', {})
export class GameController {
  @request('POST', 'server-updated', {statusCodes: []})
  static async serverUpdated(model: VoidRequest, headers: RequestHeaders): Promise<VoidResponse> {
    RequestModelValidator.validateVoidRequest(model);
    console.log('starting');
    await PubSubGameScript.pushAndWait<PubSubGameScriptUpdatedRequest, PubSubGameScriptUpdatedResponse>('game-script', {
      messageId: (Math.random() * 100000000).toFixed(0),
      responseId: PubSubGameScript.id,
    });
    console.log('done');

    return {};
  }
  @request('POST', 'new-game', {statusCodes: []})
  static async newGame(model: NewGameRequest, headers: RequestHeaders): Promise<NewGameResponse> {
    RequestModelValidator.validateNewGameRequest(model);
    console.log('starting');
    const response = await PubSubNewGame.pushAndWait<PubSubNewGameRequest, PubSubNewGameResponse>('new-game', {
      messageId: (Math.random() * 100000000).toFixed(0),
      responseId: PubSubNewGame.id,
      gameRules: {items: []},
      numberOfPlayers: model.numberOfPlayers,
    });
    console.log('done');

    return {
      error: response.error,
    };
  }
}
ServerRouter.registerClass(GameController);
