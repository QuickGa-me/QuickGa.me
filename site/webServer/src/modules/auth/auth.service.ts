import * as jwt from 'jsonwebtoken';
import {Component, Inject} from '@nestjs/common';
import {UserModel} from "@common/models/user/userModel";
import {Config} from "@serverCommon/config";

@Component()
export class AuthService {
    async createToken(user: UserModel): Promise<string> {
        const expiresIn = 60 * 60;
        const token = jwt.sign(user, Config.jwtKey, {expiresIn});
        return token;
    }


}