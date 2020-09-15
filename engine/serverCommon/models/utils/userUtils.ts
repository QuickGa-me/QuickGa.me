import * as jsonwebtoken from 'jsonwebtoken';
import {UserModel} from '@common/models/user/userModel';
import {Config} from '../../config';
export class UserUtils {
    public static verifyUser(jwt: string, fail: () => void): UserModel | null {
        if (!jwt) {
            fail();
            return null;
        }
        let userModel: UserModel;
        try {
            userModel = jsonwebtoken.verify(jwt, Config.jwtKey) as UserModel;
            if (!userModel) {
                fail();

                return null;
            }
        } catch (ex) {
            fail();

            return null;
        }
        return userModel;
    }
}
