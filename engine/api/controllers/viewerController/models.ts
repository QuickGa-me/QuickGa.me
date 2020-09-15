import {HttpViewerModel} from '@serverCommon/models/httpViewerModel';

export interface GetViewerDetailsRequest {}
export interface GetViewerDetailsResponse {
  viewer: HttpViewerModel;
}
