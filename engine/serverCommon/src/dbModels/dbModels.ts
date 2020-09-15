import {DbViewerModel} from './dbViewerModel';
import {DbAnalyticsEventModel} from './dbAnalyticsEvent';
import {DbErrorModel} from './dbError';
import {DocumentManager} from '../services/db/dataManager';

export class DbModels {
  static analyticEvent = new DocumentManager<DbAnalyticsEventModel>('bbp-analytic-event');
  static error = new DocumentManager<DbErrorModel>('bbp-error');
  static viewer = new DocumentManager<DbViewerModel>('bbp-viewer');
}
