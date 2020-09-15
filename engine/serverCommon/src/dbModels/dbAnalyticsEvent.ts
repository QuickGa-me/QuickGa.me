import {ObjectId} from 'bson';

export type DbAnalyticsEventModel = {
  _id: ObjectId;
  country: string;
  eventName: string;
  ipAddress: string;
  isDesktopViewer: string;
  isMobileViewer: string;
  isTabletViewer: string;
  metadata?: string;
  referrer: string;
  timeLogged: Date;
  userAgent: string;

  headers: any;
};
