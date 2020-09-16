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

  static validateGetGameDetailsRequest(
    model: import('../controllers/gameDetailsController/models').GetGameDetailsRequest
  ): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('GetGameDetailsRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('GetGameDetailsRequest', 'mismatch', '');

    if (model['gameId'] === null) throw new ValidationError('GetGameDetailsRequest', 'missing', 'gameId');
    fieldCount++;
    if (typeof model['gameId'] !== 'string') throw new ValidationError('GetGameDetailsRequest', 'mismatch', 'gameId');

    if (Object.keys(model).length !== fieldCount)
      throw new ValidationError('GetGameDetailsRequest', 'too-many-fields', '');

    return true;
  }

  static validateitems(model: {key: string; value: string}): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('items', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('items', 'mismatch', '');

    if (model['key'] === null) throw new ValidationError('items', 'missing', 'key');
    fieldCount++;
    if (typeof model['key'] !== 'string') throw new ValidationError('items', 'mismatch', 'key');
    if (model['value'] === null) throw new ValidationError('items', 'missing', 'value');
    fieldCount++;
    if (typeof model['value'] !== 'string') throw new ValidationError('items', 'mismatch', 'value');

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('items', 'too-many-fields', '');

    return true;
  }

  static validateGameRules(
    model: import('/Users/dested/code/QuickGa.me/engine/serverCommon/src/dbModels/dbGame').GameRules
  ): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('GameRules', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('GameRules', 'mismatch', '');

    if (model['items'] === null) throw new ValidationError('GameRules', 'missing', 'items');
    fieldCount++;
    if (typeof model['items'] !== 'object' || !('length' in model['items']))
      throw new ValidationError('GameRules', 'mismatch', 'items');
    for (let i = 0; i < model['items'].length; i++) {
      const itemsElem = model['items'][i];
      this.validateitems(itemsElem);
    }

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('GameRules', 'too-many-fields', '');

    return true;
  }

  static validateJoinLobbyRequest(
    model: import('../controllers/gameDetailsController/models').JoinLobbyRequest
  ): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('JoinLobbyRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('JoinLobbyRequest', 'mismatch', '');

    if (model['gameId'] === null) throw new ValidationError('JoinLobbyRequest', 'missing', 'gameId');
    fieldCount++;
    if (typeof model['gameId'] !== 'string') throw new ValidationError('JoinLobbyRequest', 'mismatch', 'gameId');
    if (model['rules'] === null) throw new ValidationError('JoinLobbyRequest', 'missing', 'rules');
    fieldCount++;
    this.validateGameRules(model['rules']);

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('JoinLobbyRequest', 'too-many-fields', '');

    return true;
  }

  static validateJoinLobbyGameRequest(
    model: import('../controllers/gameDetailsController/models').JoinLobbyGameRequest
  ): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('JoinLobbyGameRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('JoinLobbyGameRequest', 'mismatch', '');

    if (model['gameId'] === null) throw new ValidationError('JoinLobbyGameRequest', 'missing', 'gameId');
    fieldCount++;
    if (typeof model['gameId'] !== 'string') throw new ValidationError('JoinLobbyGameRequest', 'mismatch', 'gameId');
    if (model['lobbyCode'] === null) throw new ValidationError('JoinLobbyGameRequest', 'missing', 'lobbyCode');
    fieldCount++;
    if (typeof model['lobbyCode'] !== 'string')
      throw new ValidationError('JoinLobbyGameRequest', 'mismatch', 'lobbyCode');

    if (Object.keys(model).length !== fieldCount)
      throw new ValidationError('JoinLobbyGameRequest', 'too-many-fields', '');

    return true;
  }

  static validateStartPrivateLobbyRequest(
    model: import('../controllers/gameDetailsController/models').StartPrivateLobbyRequest
  ): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('StartPrivateLobbyRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('StartPrivateLobbyRequest', 'mismatch', '');

    if (model['gameId'] === null) throw new ValidationError('StartPrivateLobbyRequest', 'missing', 'gameId');
    fieldCount++;
    if (typeof model['gameId'] !== 'string')
      throw new ValidationError('StartPrivateLobbyRequest', 'mismatch', 'gameId');
    if (model['rules'] === null) throw new ValidationError('StartPrivateLobbyRequest', 'missing', 'rules');
    fieldCount++;
    this.validateGameRules(model['rules']);

    if (Object.keys(model).length !== fieldCount)
      throw new ValidationError('StartPrivateLobbyRequest', 'too-many-fields', '');

    return true;
  }

  static validatePlayerJoinRequest(
    model: import('../controllers/lobbySocketController/models').PlayerJoinRequest
  ): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('PlayerJoinRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('PlayerJoinRequest', 'mismatch', '');

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('PlayerJoinRequest', 'too-many-fields', '');

    return true;
  }

  static validateVoteStartRequest(
    model: import('../controllers/lobbySocketController/models').VoteStartRequest
  ): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('VoteStartRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('VoteStartRequest', 'mismatch', '');

    if (model['voteStart'] === null) throw new ValidationError('VoteStartRequest', 'missing', 'voteStart');
    fieldCount++;
    if (typeof model['voteStart'] !== 'boolean') throw new ValidationError('VoteStartRequest', 'mismatch', 'voteStart');

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('VoteStartRequest', 'too-many-fields', '');

    return true;
  }

  static validateLoginRequest(model: import('../controllers/playerController/models').LoginRequest): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('LoginRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('LoginRequest', 'mismatch', '');

    if (model['email'] === null) throw new ValidationError('LoginRequest', 'missing', 'email');
    fieldCount++;
    if (typeof model['email'] !== 'string') throw new ValidationError('LoginRequest', 'mismatch', 'email');
    if (model['password'] === null) throw new ValidationError('LoginRequest', 'missing', 'password');
    fieldCount++;
    if (typeof model['password'] !== 'string') throw new ValidationError('LoginRequest', 'mismatch', 'password');

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('LoginRequest', 'too-many-fields', '');

    return true;
  }

  static validateRegisterRequest(model: import('../controllers/playerController/models').RegisterRequest): boolean {
    let fieldCount = 0;
    if (model === null) throw new ValidationError('RegisterRequest', 'missing', '');
    if (typeof model !== 'object') throw new ValidationError('RegisterRequest', 'mismatch', '');

    if (model['email'] === null) throw new ValidationError('RegisterRequest', 'missing', 'email');
    fieldCount++;
    if (typeof model['email'] !== 'string') throw new ValidationError('RegisterRequest', 'mismatch', 'email');
    if (model['password'] === null) throw new ValidationError('RegisterRequest', 'missing', 'password');
    fieldCount++;
    if (typeof model['password'] !== 'string') throw new ValidationError('RegisterRequest', 'mismatch', 'password');
    if (model['name'] === null) throw new ValidationError('RegisterRequest', 'missing', 'name');
    fieldCount++;
    if (typeof model['name'] !== 'string') throw new ValidationError('RegisterRequest', 'mismatch', 'name');

    if (Object.keys(model).length !== fieldCount) throw new ValidationError('RegisterRequest', 'too-many-fields', '');

    return true;
  }
}
