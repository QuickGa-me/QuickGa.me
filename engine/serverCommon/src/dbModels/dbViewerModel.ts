import {ObjectId} from 'bson';
import {HttpViewerModel} from '../models/httpViewerModel';

export type DbViewerModel = {
  _id: ObjectId;
  name: string;
};

export class DbViewerLogic {
  static map(viewerModel: DbViewerModel): HttpViewerModel {
    return {
      viewerId: viewerModel._id.toHexString(),
      name: viewerModel.name,
    };
  }
}
