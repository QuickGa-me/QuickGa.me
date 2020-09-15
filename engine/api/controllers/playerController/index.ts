import {controller, request} from '@serverCommon/utils/decorators';
import {RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {GetPlayerDetailsResponse} from './models';
import {RequestModelValidator} from '../../utils/validation';
import {AuthService} from '@serverCommon/services/authService';
import {ResponseError} from '@serverCommon/utils/responseError';
import {VoidRequest} from '@serverCommon/models/controller';

@controller('player', {})
export class PlayerController {
  @request('GET', 'details', {statusCodes: [400]})
  static async getPlayerDetails(model: VoidRequest, headers: RequestHeaders): Promise<GetPlayerDetailsResponse> {
    RequestModelValidator.validateVoidRequest(model);
    const player = AuthService.validatePlayerToken(headers.authorization);
    throw new ResponseError(401, 'abc');
  }
}

ServerRouter.registerClass(PlayerController);
