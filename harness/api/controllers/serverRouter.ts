import {Controller} from '@serverCommon/utils/decorators';
import {LambdaRequestEvent} from '@serverCommon/utils/models';
import {assertType} from '@serverCommon/utils/typeUtils';
import {match, MatchFunction} from 'path-to-regexp';
import {DbErrorLogic} from '@serverCommon/dbModels/dbError';
import {ResponseError} from '@serverCommon/utils/responseError';

if (!Symbol.asyncIterator) {
  (Symbol as any).asyncIterator = Symbol.for('Symbol.asyncIterator');
}

export class ServerRouter {
  static bespokeCalls: {invoke: (event: LambdaRequestEvent<any>, context: any) => Promise<any>; key: string}[] = [];
  static endpoints: {
    invoke: (event: LambdaRequestEvent<any>, context: any) => any;
    match: MatchFunction<{[key: string]: string}>;
    method: string;
    path: string;
  }[] = [];

  static registerClass(item: any) {
    assertType<Controller>(item);

    for (const requestMethod of item.requestMethods) {
      const path = '/' + item.path + (requestMethod.path ? '/' + requestMethod.path : '');
      this.endpoints.push({
        method: requestMethod.method,
        path,
        match: match(path),
        invoke: async (event: LambdaRequestEvent<any>, context: any) => {
          context.callbackWaitsForEmptyEventLoop = false;
          event.body = event.body && JSON.parse(event.body as any);
          if (event.pathParameters) {
            delete event.pathParameters.any;
          }
          event.params = {...event.body, ...event.queryStringParameters, ...event.pathParameters};
          const debugParams = {...event.params};
          delete debugParams.password;
          delete debugParams.newPassword;
          event.headers.authorization = event.headers.authorization || (event.headers as any).Authorization;
          console.log(event.path);
          /*console.log(JSON.stringify(debugParams, null, '\t'));
          console.log(JSON.stringify(event.headers, null, '\t'));
          console.log(JSON.stringify(event.requestContext, null, '\t'));
          */ try {
            const response = await item[requestMethod.name](event.params, event.headers, event.requestContext, event);
            if (response.$$raw) {
              return response.$$raw;
            }
            if (response.timeout) {
              return respond(500, {error: 'There was an issue processing your request.'});
            }
            // console.log(200, JSON.stringify(response, null, 2));
            return respond(200, response);
          } catch (ex) {
            if (ex.isResponseError) {
              const responseEx: ResponseError = ex;
              console.log(responseEx.statusCode, responseEx.error);
              return respond(responseEx.statusCode, {error: responseEx.error});
            } else if (ex.isValidationError) {
              console.error('validation', ex);
              await DbErrorLogic.log(
                'Server 400',
                JSON.stringify(event, null, '\t') + ' ' + ex.message + ' ' + ex.stack,
                null
              );
              return respond(400, {error: 'Request model was invalid'});
            } else {
              console.error(500, ex);
              await DbErrorLogic.log(
                'Server 500',
                JSON.stringify(event, null, '\t') + ' ' + ex.message + ' ' + ex.stack,
                null
              );
              return respond(500, {error: 'An unexpected server error has occurred.'});
            }
          }
        },
      });
    }

    for (const eventMethod of item.eventMethods) {
      this.bespokeCalls.push({
        key: `${item.path}_${eventMethod}`,
        invoke: async (event: any, context: any) => {
          try {
            context && (context.callbackWaitsForEmptyEventLoop = false);
            if (event) {
              event.body = event.body && JSON.parse(event.body as any);
              event.params = {...event.body, ...event.queryStringParameters, ...event.pathParameters};
              const result = await item[eventMethod](event);
              return result;
            }
          } catch (ex) {
            await DbErrorLogic.log(
              'Server 500 ' + `${item.path}_${eventMethod}`,
              JSON.stringify(event, null, '\t') + ' ' + ex.message + ' ' + ex.stack,
              null
            );
            console.error(ex);
            return null;
          }
        },
      });
    }
    for (const eventMethod of item.websocketMethods) {
      this.bespokeCalls.push({
        key: `${item.path}_${eventMethod}`,
        invoke: async (event: any, context: any) => {
          try {
            context && (context.callbackWaitsForEmptyEventLoop = false);
            if (event) {
              event.body = event.body && JSON.parse(event.body as any);
              event.params = {...event.body, ...event.queryStringParameters, ...event.pathParameters};
              const result = await item[eventMethod](event);
              return result;
            }
          } catch (ex) {
            if (ex.isResponseError) {
              const responseEx: ResponseError = ex;
              console.log(responseEx.statusCode, responseEx.error);
              return respond(responseEx.statusCode, {error: responseEx.error});
            } else if (ex.isValidationError) {
              console.error('validation', ex);
              await DbErrorLogic.log(
                'Server 400',
                JSON.stringify(event, null, '\t') + ' ' + ex.message + ' ' + ex.stack,
                null
              );
              return respond(400, {error: 'Request model was invalid'});
            } else {
              console.error(500, ex);
              await DbErrorLogic.log(
                'Server 500',
                JSON.stringify(event, null, '\t') + ' ' + ex.message + ' ' + ex.stack,
                null
              );
              return respond(500, {error: 'An unexpected server error has occurred.'});
            }
          }
        },
      });
    }
  }
}

function respond(statusCode: number, response: any) {
  const result = {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(response),
  };
  return result;
}
