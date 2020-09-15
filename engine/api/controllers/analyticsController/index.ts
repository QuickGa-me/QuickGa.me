import {controller, request} from '@serverCommon/utils/decorators';
import {RequestContext, RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {RequestModelValidator} from '../../utils/validation';
import {EventRequest, MetaResponse} from './models';
import {AwsService} from '@serverCommon/services/awsService';
import {VoidRequest, VoidResponse} from '@serverCommon/models/controller';
import {DbModels} from '@serverCommon/dbModels/dbModels';
import {ResponseError} from '@serverCommon/utils/responseError';

@controller('analytics', {})
export class AnalyticsController {
  @request('POST', 'event', {statusCodes: []})
  static async event(
    model: EventRequest,
    headers: RequestHeaders,
    requestContext: RequestContext
  ): Promise<VoidResponse> {
    RequestModelValidator.validateEventRequest(model);

    const result = await DbModels.analyticEvent.insertDocument({
      ipAddress: requestContext.identity.sourceIp,
      referrer: (headers as any).Referer,
      isDesktopViewer: (headers as any)['CloudFront-Is-Desktop-Viewer'],
      isMobileViewer: (headers as any)['CloudFront-Is-Mobile-Viewer'],
      isTabletViewer: (headers as any)['CloudFront-Is-Tablet-Viewer'],
      country: (headers as any)['CloudFront-Viewer-Country'],
      userAgent: (headers as any)['User-Agent'],
      timeLogged: new Date(),
      eventName: model.eventName,
      metadata: model.metaData,
      headers,
    });

    await AwsService.sendDebugEmail('tap website', JSON.stringify(result));

    return {};
  }

  @request('POST', 'meta', {statusCodes: []})
  static async $meta(model: VoidRequest, headers: RequestHeaders): Promise<MetaResponse> {
    throw new ResponseError(500, 'Meta');
  }
}

ServerRouter.registerClass(AnalyticsController);
