/* This file was generated by https://github.com/dested/serverless-client-builder */
/* tslint:disable */

export class ValidationError extends Error {
  isValidationError = true;
  constructor(public model: string, public reason: 'missing' | 'mismatch' | 'too-many-fields', public field: string) {
    super();
  }
}

export class RequestModelValidator {
  static validateEventRequest(model: import('../controllers/analyticsController/models').EventRequest): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('EventRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('EventRequest', 'mismatch', '');

    if (model['eventName'] === null) throw new ValidationError('EventRequest', 'missing', 'eventName');
    fieldCount++;
    if (typeof model['eventName'] !== 'string') throw new ValidationError('EventRequest', 'mismatch', 'eventName');
    if (model['metaData'] === null) throw new ValidationError('EventRequest', 'missing', 'metaData');
    fieldCount++;
    if (typeof model['metaData'] !== 'string') throw new ValidationError('EventRequest', 'mismatch', 'metaData');
    if (model['time'] === null) throw new ValidationError('EventRequest', 'missing', 'time');
    fieldCount++;
    if (typeof model['time'] !== 'string') throw new ValidationError('EventRequest', 'mismatch', 'time');

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('EventRequest', 'too-many-fields', '');

    return true;
  }

  static validateVoidRequest(
    model: import('/Users/dested/code/QuickGa.me/engine/serverCommon/src/models/controller').VoidRequest
  ): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('VoidRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('VoidRequest', 'mismatch', '');

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('VoidRequest', 'too-many-fields', '');

    return true;
  }
}
