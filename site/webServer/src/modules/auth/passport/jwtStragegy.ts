import * as passport from 'passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Component, Inject} from '@nestjs/common';
import {AuthService} from '../auth.service';
import {UserModel} from '@common/models/user/userModel';
import {Config} from '@serverCommon/config';

@Component()
export class JwtStrategy extends Strategy {
    constructor() {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: Config.jwtKey
            },
            async (req, payload, next) => await this.validateUser(payload, next)
        );
        passport.use(this);
    }

    async validateUser(user: UserModel, done: any): Promise<boolean> {
        done(null, user);
        return true;
    }
}
