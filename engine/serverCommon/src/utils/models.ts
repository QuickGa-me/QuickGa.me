export interface LambdaRequestEvent<T> {
  body: T;
  headers: RequestHeaders;
  httpMethod: string;
  params: T;
  path: string;
  pathParameters: T;
  queryStringParameters: T;
  requestContext: RequestContext;
}

export interface RequestHeaders {
  authorization?: string;
}
export type RequestContext = any;
