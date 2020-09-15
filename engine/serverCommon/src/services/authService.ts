import * as jsonWebToken from 'jsonwebtoken';
import {Config} from '../config/config';
import {ObjectId} from 'bson';
import {ResponseError} from '@serverCommon/utils/responseError';

export class AuthService {
  static async createPlayerToken(jwtChannelGame: JwtPlayer): Promise<string> {
    const token = jsonWebToken.sign({playerId: jwtChannelGame.playerId.toHexString()}, Config.playerJwtKey, {
      expiresIn: '4d',
    });
    return token;
  }

  static validatePlayerToken(authorization?: string): JwtPlayer {
    if (!authorization) {
      throw new ResponseError(401, 'Unauthorized');
    }
    try {
      const result = jsonWebToken.verify(authorization.replace('Bearer ', ''), Config.playerJwtKey) as {
        playerId: string;
      };

      if (!result?.playerId) {
        throw new ResponseError(401, 'Unauthorized');
      }

      return {
        playerId: ObjectId.createFromHexString(result.playerId),
      };
    } catch (ex) {
      console.error(ex);
      throw new ResponseError(401, 'Unauthorized');
    }
  }
}
export type JwtPlayer = {
  playerId: ObjectId;
};
