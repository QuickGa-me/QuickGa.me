import * as bcrypt from 'bcryptjs';
import {controller, request} from '@serverCommon/utils/decorators';
import {RequestHeaders} from '@serverCommon/utils/models';
import {ServerRouter} from '../serverRouter';
import {LoginRequest, LoginResponse, RegisterRequest} from './models';
import {RequestModelValidator} from '../../utils/validation';
import {AuthService} from '@serverCommon/services/authService';
import {ResponseError} from '@serverCommon/utils/responseError';
import {VoidRequest} from '@serverCommon/models/controller';
import {DbModels} from '@serverCommon/dbModels/dbModels';
import {Utils} from '@common/utils';
import {DbPlayerLogic} from '@serverCommon/dbModels/dbPlayer';
import {NameGenerator} from '@serverCommon/utils/nameGenerator';

@controller('player', {})
export class PlayerController {
  @request('GET', 'details', {statusCodes: [401]})
  static async getPlayerDetails(model: VoidRequest, headers: RequestHeaders): Promise<LoginResponse> {
    RequestModelValidator.validateVoidRequest(model);
    const playerJwt = AuthService.validatePlayerToken(headers.authorization);
    const player = await DbModels.player.getOne({_id: playerJwt.playerId});
    if (!player) {
      throw new ResponseError(401, 'This account does not exist');
    }

    return {
      jwt: await AuthService.createPlayerToken({playerId: player._id}),
      player: DbPlayerLogic.map(player),
    };
  }

  @request('POST', 'login', {statusCodes: [400]})
  static async login(model: LoginRequest, headers: RequestHeaders): Promise<LoginResponse> {
    RequestModelValidator.validateLoginRequest(model);

    const player = await DbModels.player.getOne({email: model.email});
    if (!player) {
      await Utils.timeout(500);
      throw new ResponseError(400, 'The email or password was invalid');
    }
    if (!(await bcrypt.compare(model.password, player.passwordHash))) {
      await Utils.timeout(500);
      throw new ResponseError(400, 'The email or password was invalid');
    }
    return {
      jwt: await AuthService.createPlayerToken({playerId: player._id}),
      player: DbPlayerLogic.map(player),
    };
  }

  @request('POST', 'register', {statusCodes: [400]})
  static async register(model: RegisterRequest, headers: RequestHeaders): Promise<LoginResponse> {
    RequestModelValidator.validateRegisterRequest(model);
    if ((await DbModels.player.count({email: model.email})) > 0) {
      throw new ResponseError(400, 'Sorry, this account already exists');
    }

    const player = await DbModels.player.insertDocument({
      email: model.email,
      name: model.name,
      passwordHash: await bcrypt.hash(model.password, await bcrypt.genSalt(10)),
      anon: false,
    });

    return {
      jwt: await AuthService.createPlayerToken({playerId: player._id}),
      player: DbPlayerLogic.map(player),
    };
  }

  @request('POST', 'convert-anon', {statusCodes: [400]})
  static async convertAnon(model: RegisterRequest, headers: RequestHeaders): Promise<LoginResponse> {
    RequestModelValidator.validateRegisterRequest(model);
    const playerJwt = AuthService.validatePlayerToken(headers.authorization);

    if ((await DbModels.player.count({email: model.email})) > 0) {
      throw new ResponseError(400, 'Sorry, this account already exists');
    }

    let player = await DbModels.player.getOne({_id: playerJwt.playerId});
    if (!player) {
      throw new ResponseError(400, 'Sorry, this account cannot be found.');
    }

    await DbModels.player.updateOne(
      {_id: player._id},
      {
        $set: {
          email: model.email,
          name: model.name,
          passwordHash: await bcrypt.hash(model.password, await bcrypt.genSalt(10)),
          anon: false,
        },
      }
    );
    player = (await DbModels.player.getOne({_id: playerJwt.playerId}))!;

    return {
      jwt: await AuthService.createPlayerToken({playerId: player._id}),
      player: DbPlayerLogic.map(player),
    };
  }

  @request('POST', 'anon', {statusCodes: [400]})
  static async playAnon(model: VoidRequest, headers: RequestHeaders): Promise<LoginResponse> {
    RequestModelValidator.validateVoidRequest(model);

    const player = await DbModels.player.insertDocument({
      email: '',
      name: NameGenerator.generateName(),
      passwordHash: '',
      anon: true,
    });

    return {
      jwt: await AuthService.createPlayerToken({playerId: player._id}),
      player: DbPlayerLogic.map(player),
    };
  }
}

ServerRouter.registerClass(PlayerController);
