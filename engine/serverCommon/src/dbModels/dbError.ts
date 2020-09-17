import {ObjectId} from 'bson';
import {DbModels} from './dbModels';
import {AwsService} from '../services/awsService';

export type DbErrorModel = {
  _id: ObjectId;
  category: string;
  date: Date;
  message: string;
  request?: string;
};

export class DbErrorLogic {
  static async log(category: string, message: string, request?: any) {
    const error = await DbModels.error.insertDocument({
      category,
      message,
      request: JSON.stringify(request),
      date: new Date(),
    });
    console.error(error);
    await AwsService.sendDebugEmail(
      'server error',
      `<pre>${error.date}
${error.category}
${error.message}
${error.request}</pre>`
    );
  }
}
