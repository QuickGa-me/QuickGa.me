import {ApiGatewayManagementApi} from 'aws-sdk';

const publishUrl = () => {
  if (process.env.IS_OFFLINE) {
    return `http://localhost:3939`;
  } else {
    return `https://lobby.quickga.me`;
  }
};
const options = {
  apiVersion: '2018-11-29',
  endpoint: publishUrl(),
  region: process.env.IS_OFFLINE ? 'localhost' : 'us-west-2',
};
const apigwManagementApi = new ApiGatewayManagementApi(options);

export class SocketService {
  static async publish<T>(connectionId: string, data: T) {
    try {
      await apigwManagementApi.postToConnection({ConnectionId: connectionId, Data: JSON.stringify(data)}).promise();
    } catch (ex) {
      console.error('PUBLISH ERROR', ex);
      throw ex;
    }
  }
  static async disconnect<T>(connectionId: string) {
    try {
      await apigwManagementApi.deleteConnection({ConnectionId: connectionId}).promise();
    } catch (ex) {}
  }
}
