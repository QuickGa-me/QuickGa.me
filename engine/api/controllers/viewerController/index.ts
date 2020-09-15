import {controller, request} from '@serverCommon/utils/decorators';
import {RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {GetViewerDetailsRequest, GetViewerDetailsResponse} from './models';
import {RequestModelValidator} from '../../utils/validation';
import {AuthService} from '@serverCommon/services/authService';
import {ResponseError} from '@serverCommon/utils/responseError';

@controller('viewer', {})
export class ViewerController {
  @request('GET', 'viewer-details', {statusCodes: [400]})
  static async getViewerDetails(
    model: GetViewerDetailsRequest,
    headers: RequestHeaders
  ): Promise<GetViewerDetailsResponse> {
    RequestModelValidator.validateGetViewerDetailsRequest(model);
    const viewer = AuthService.validatePlayerToken(headers.authorization);
    throw new ResponseError(401, 'abc');
  }
}

ServerRouter.registerClass(ViewerController);
