import {CanActivate, ExecutionContext, Guard, HttpStatus} from "@nestjs/common";
import {Observable} from "rxjs/Observable";
import * as passport from "passport";
import {HttpException} from "@nestjs/core";

@Guard()
export class AuthGuard implements CanActivate {
    async canActivate(dataOrRequest, context: ExecutionContext): Promise<boolean> {
        const isAuthenticated = await new Promise<boolean>((resolve, reject) => {
            passport.authenticate('jwt', {session: false}, (_, user, __) => {
                if (user) {
                    return resolve(true);
                }
                return resolve(false);
            })(dataOrRequest.res.req, dataOrRequest.res, dataOrRequest.nex);
        });
        if (!isAuthenticated) {
            throw new HttpException('', HttpStatus.UNAUTHORIZED);
        }
        return true;
    }
}