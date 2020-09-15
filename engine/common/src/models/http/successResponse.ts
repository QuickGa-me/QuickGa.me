export class SuccessResponse<T = {}> {
  static success<T>(body?: T): SuccessResponse<T> {
    return {success: true, body};
  }

  static fail<T>(body?: T): SuccessResponse<T> {
    return {success: false, body};
  }

  success: boolean;
  body?: T;
}
