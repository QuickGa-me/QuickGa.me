import {controller, request} from '@serverCommon/utils/decorators';
import {RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {
  GetGameDetailsRequest,
  GetGameDetailsResponse,
  GetGamesResponse,
  JoinLobbyGameRequest,
  JoinLobbyRequest,
  JoinLobbyResponse,
  StartPrivateLobbyRequest,
} from './models';
import {RequestModelValidator} from '../../utils/validation';
import {AuthService} from '@serverCommon/services/authService';
import {ResponseError} from '@serverCommon/utils/responseError';
import {VoidRequest} from '@serverCommon/models/controller';
import {DbModels} from '@serverCommon/dbModels/dbModels';
import {Aggregator, AggregatorLookup} from '@serverCommon/services/db/typeSafeAggregate';
import {DbLobbyLogic, DbLobbyModel, DbLobbyPlayerModel} from '@serverCommon/dbModels/dbLobby';
import {ObjectId} from 'bson';

@controller('game-details', {})
export class GameDetailsController {
  @request('GET', '', {statusCodes: []})
  static async getGames(model: VoidRequest, headers: RequestHeaders): Promise<GetGamesResponse> {
    RequestModelValidator.validateVoidRequest(model);
    return {
      games: [
        {
          id: '1',
          description: 'A brand new maze racer from the makers of the old maze racer!',
          name: 'Maze Race!!',
          logo: 'https://dested.com/assets/project-images/hexmaze.png',
        },
        {
          id: '2',
          description: 'A brand new maze racer from the makers of the old maze racer!',
          name: 'Maze Race!!',
          logo: 'https://dested.com/assets/project-images/hexmaze.png',
        },
        {
          id: '3',
          description: 'A brand new maze racer from the makers of the old maze racer!',
          name: 'Maze Race!!',
          logo: 'https://dested.com/assets/project-images/hexmaze.png',
        },
      ],
    };
  }
  @request('GET', 'details', {statusCodes: []})
  static async getGameDetails(model: GetGameDetailsRequest, headers: RequestHeaders): Promise<GetGameDetailsResponse> {
    RequestModelValidator.validateGetGameDetailsRequest(model);
    return {
      details: {
        id: 'maze-race',
        description: 'A brand new maze racer from the makers of the old maze racer!',
        name: 'Maze Race!!',
        logo: 'https://dested.com/assets/project-images/hexmaze.png',
        author: 'dested',
        numberOfActivePlayers: 17,
        gameRulesSchema: {
          items: [{key: 'shapes', option: {type: 'switch'}}],
        },
        gameRulesDefault: {
          items: [{key: 'shapes', value: 'true'}],
        },
      },
    };
  }

  @request('POST', 'join-lobby', {statusCodes: [400]})
  static async joinLobby(model: JoinLobbyRequest, headers: RequestHeaders): Promise<JoinLobbyResponse> {
    RequestModelValidator.validateJoinLobbyRequest(model);
    const player = AuthService.validatePlayerToken(headers.authorization);

    const game = await DbModels.game.getById(model.gameId);
    if (!game) {
      throw new ResponseError(400, 'This game cannot be found!');
    }

    const lobbyResult = await Aggregator.start<DbLobbyModel>()
      .$match({
        gameId: game._id,
        active: true,
        public: true,
        // gameRules: model.configuration, this needs to be more complex, and support any
      })
      .$lookupCallback((agg, lookupAgg: AggregatorLookup<DbLobbyPlayerModel>) => ({
        from: DbModels.lobbyPlayer.collectionName,
        as: 'players',
        localField: agg.key((a) => a._id),
        foreignField: lookupAgg.key((a) => a.lobbyId),
      }))
      .$unwind('players')
      .$group((agg) => [agg.referenceKey((a) => a._id), {playersCount: {$sum: 1}}])
      .$match({playersCount: {$lte: game.gameConfig.lobbyRules.maxPlayers - 1}})
      .$sort({playersCount: -1})
      .$limit(1)
      .result(await DbModels.lobby.getCollection());

    let lobbyId: ObjectId;
    if (lobbyResult.length === 0) {
      const lobby = await DbModels.lobby.insertDocument({
        gameRules: model.rules,
        state: 'created',
        active: true,
        public: true,
        gameId: ObjectId.createFromHexString(model.gameId),
        lobbyCode: this.generateLobbyCode(),
      });
      lobbyId = lobby._id;
    } else {
      lobbyId = lobbyResult[0]._id as ObjectId;
    }

    await DbModels.lobbyPlayer.insertDocument({
      lobbyId,
      voteStart: false,
      playerId: player.playerId,
      connectionId: undefined,
    });
    return {
      lobbyId: lobbyId.toHexString(),
    };
  }
  @request('POST', 'join-lobby-game', {statusCodes: [400]})
  static async joinGame(model: JoinLobbyGameRequest, headers: RequestHeaders): Promise<JoinLobbyResponse> {
    RequestModelValidator.validateJoinLobbyRequest(model);
    const player = AuthService.validatePlayerToken(headers.authorization);

    const game = await DbModels.game.getById(model.gameId);
    if (!game) {
      throw new ResponseError(400, 'This game cannot be found!');
    }

    const lobbyResult = await Aggregator.start<DbLobbyModel>()
      .$match({
        gameId: game._id,
        active: true,
        lobbyCode: model.lobbyCode,
      })
      .$lookupCallback((agg, lookupAgg: AggregatorLookup<DbLobbyPlayerModel>) => ({
        from: DbModels.lobbyPlayer.collectionName,
        as: 'players',
        localField: agg.key((a) => a._id),
        foreignField: lookupAgg.key((a) => a.lobbyId),
      }))
      .$unwind('players')
      .$group((agg) => [agg.referenceKey((a) => a._id), {playersCount: {$sum: 1}}])
      .$match({playersCount: {$lte: game.gameConfig.lobbyRules.maxPlayers - 1}})
      .$sort({playersCount: -1})
      .$limit(1)
      .result(await DbModels.lobby.getCollection());

    let lobbyId: ObjectId;
    if (lobbyResult.length === 0) {
      throw new ResponseError(400, 'Sorry, this game is not available!');
    } else {
      lobbyId = lobbyResult[0]._id as ObjectId;
    }

    await DbModels.lobbyPlayer.insertDocument({
      lobbyId,
      voteStart: false,
      playerId: player.playerId,
      connectionId: undefined,
    });
    return {
      lobbyId: lobbyId.toHexString(),
    };
  }

  @request('POST', 'start-private-lobby', {statusCodes: [400]})
  static async startPrivateLobby(model: StartPrivateLobbyRequest, headers: RequestHeaders): Promise<JoinLobbyResponse> {
    RequestModelValidator.validateJoinLobbyRequest(model);
    const player = AuthService.validatePlayerToken(headers.authorization);

    const game = await DbModels.game.getById(model.gameId);
    if (!game) {
      throw new ResponseError(400, 'This game cannot be found!');
    }

    const lobby = await DbModels.lobby.insertDocument({
      gameRules: model.rules,
      state: 'created',
      active: true,
      public: true,
      gameId: ObjectId.createFromHexString(model.gameId),
      lobbyCode: this.generateLobbyCode(),
    });

    await DbModels.lobbyPlayer.insertDocument({
      lobbyId: lobby._id,
      playerId: player.playerId,
      connectionId: undefined,
      voteStart: false,
    });
    return {
      lobbyId: lobby._id.toHexString(),
    };
  }

  private static generateLobbyCode() {
    function s4() {
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor((1 + Math.random()) * 26)];
    }

    return `${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}`;
  }
}

ServerRouter.registerClass(GameDetailsController);
