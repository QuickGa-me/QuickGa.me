import {ObjectId} from 'bson';
import {DbModels} from './dbModels';

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
  }
}
