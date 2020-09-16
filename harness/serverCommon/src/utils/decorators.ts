import {LambdaRequestEvent, RequestContext, RequestHeaders} from './models';

export type Controller = {
  eventMethods: string[];
  path: string;
  requestMethods: {method: string; name: string; options: any; path: string}[];
  websocketMethods: string[];
} & {
  [key: string]: (
    params: any,
    headers?: RequestHeaders,
    context?: RequestContext,
    rawEvent?: LambdaRequestEvent<any>
  ) => any;
};

export function controller(name: string, options?: any) {
  return (target: any) => {
    target.path = name;
    target.requestMethods = target.requestMethods || [];
    target.websocketMethods = target.websocketMethods || [];
    target.eventMethods = target.eventMethods || [];
  };
}

export function request(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  options: {[key: string]: any; statusCodes: number[]}
) {
  return (classType: any, name: string) => {
    classType.requestMethods = classType.requestMethods || [];
    classType.requestMethods.push({name, options, method, path});
  };
}

export function event(rate: string, options?: any) {
  return (classType: any, name: string) => {
    classType.eventMethods = classType.eventMethods || [];
    classType.eventMethods.push(name);
  };
}

export function websocketRequest(routeKey: string) {
  return (classType: any, name: string) => {
    classType.websocketMethods = classType.websocketMethods || [];
    classType.websocketMethods.push(name);
  };
}

export function websocketEvent(routeKey: string) {
  return (classType: any, name: string) => {};
}

export interface WebsocketRequestEvent<T> {
  params: {action: string; data: T; jwt: string; socket: string};
  requestContext: {
    apiId: string;
    connectionId: string;
    domainName: string;
    eventType: 'CONNECT' | 'DISCONNECT';
    stage: string;
  };
}

export interface WebSocketResponse<TData> {
  data: TData;
}
