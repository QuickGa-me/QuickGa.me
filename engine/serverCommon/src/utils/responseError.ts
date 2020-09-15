export class ResponseError extends Error {
  isResponseError = true;

  constructor(public statusCode: number, public error: string) {
    super(statusCode.toString());
  }
}
