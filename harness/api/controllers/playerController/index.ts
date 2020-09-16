import {controller, request} from '@serverCommon/utils/decorators';
import {RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {LoginRequest, LoginResponse, RegisterRequest} from './models';
import {RequestModelValidator} from '../../utils/validation';
import {AuthService} from '@serverCommon/services/authService';
import {ResponseError} from '@serverCommon/utils/responseError';
import {VoidRequest} from '@serverCommon/models/controller';
import {DbModels} from '@serverCommon/dbModels/dbModels';
import {DbPlayerLogic} from '@serverCommon/dbModels/dbPlayer';
import {NameGenerator} from '@serverCommon/utils/nameGenerator';

@controller('player', {})
export class PlayerController {
  @request('GET', 'details', {statusCodes: [401]})
  static async getPlayerDetails(model: VoidRequest, headers: RequestHeaders): Promise<LoginResponse> {
    RequestModelValidator.validateVoidRequest(model);
    const playerJwt = AuthService.validatePlayerToken(headers.authorization);
    const player = await DbModels.player.getOne({_id: playerJwt.playerId});
    if (!player) {
      throw new ResponseError(401, 'This account does not exist');
    }

    return {
      jwt: await AuthService.createPlayerToken({playerId: player._id}),
      player: DbPlayerLogic.map(player),
    };
  }

  @request('POST', 'anon', {statusCodes: [400]})
  static async playAnon(model: VoidRequest, headers: RequestHeaders): Promise<LoginResponse> {
    RequestModelValidator.validateVoidRequest(model);

    const player = await DbModels.player.insertDocument({
      email: '',
      name: NameGenerator.generateName(),
      passwordHash: '',
      anon: true,
    });

    return {
      jwt: await AuthService.createPlayerToken({playerId: player._id}),
      player: DbPlayerLogic.map(player),
    };
  }
}

ServerRouter.registerClass(PlayerController);
