import {DbPlayerModel} from './dbPlayerModel';
import {DbAnalyticsEventModel} from './dbAnalyticsEvent';
import {DbErrorModel} from './dbError';
import {DocumentManager} from '../services/db/dataManager';

export class DbModels {
  static analyticEvent = new DocumentManager<DbAnalyticsEventModel>('qg-analytic-event');
  static error = new DocumentManager<DbErrorModel>('qg-error');
  static player = new DocumentManager<DbPlayerModel>('qg-player');
}
