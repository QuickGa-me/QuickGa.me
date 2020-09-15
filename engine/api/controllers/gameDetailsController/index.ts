import {controller, request} from '@serverCommon/utils/decorators';
import {RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {GetGameDetailsRequest, GetGameDetailsResponse, GetGamesResponse, GetPlayerDetailsResponse} from './models';
import {RequestModelValidator} from '../../utils/validation';
import {AuthService} from '@serverCommon/services/authService';
import {ResponseError} from '@serverCommon/utils/responseError';
import {VoidRequest} from '@serverCommon/models/controller';

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
      },
    };
  }
}

ServerRouter.registerClass(GameDetailsController);
