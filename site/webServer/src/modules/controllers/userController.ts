import {Body, Controller, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {SuccessResponse} from '@common/models/http/successResponse';
import {AuthService} from '../auth/auth.service';
import {DBUser} from '@serverCommon/db/models/dbUser';
import {AuthGuard} from '../guards/authGuard';
import {UserModel} from '@common/models/user/userModel';
import {ObjectID} from 'bson';
import {JwtUserResponse, SignInRequest, VerifyUserRequest} from '@common/models/http/userController';

@Controller('/user')
export class UserController {
    constructor(private readonly authService: AuthService) {}

    @Post('/temp')
    async tempUser(): Promise<SuccessResponse<JwtUserResponse>> {
        try {
            const user = DBUser.randomUser();
            await DBUser.db.insertDocument(user);
            let userModel = DBUser.toUserModel(user);
            let jwt = await this.authService.createToken(userModel);
            return SuccessResponse.success({jwt: jwt, user: userModel});
        } catch (ex) {
            console.error(ex);
            return SuccessResponse.fail();
        }
    }

    @Post('/sign-in')
    async signIn(@Body() model: SignInRequest): Promise<SuccessResponse<JwtUserResponse>> {
        try {
            const user = await DBUser.db.getOne({username: model.username, password: model.password, isTemp: false});
            if (user) {
                let userModel = DBUser.toUserModel(user);
                let jwt = await this.authService.createToken(userModel);
                return SuccessResponse.success({jwt: jwt, user: userModel});
            } else {
                return SuccessResponse.fail();
            }
        } catch (ex) {
            console.error(ex);
            return SuccessResponse.fail();
        }
    }

    @UseGuards(AuthGuard)
    @Post('/verify')
    async verifyUser(
        @Body() model: VerifyUserRequest,
        @Req() req: {user: UserModel}
    ): Promise<SuccessResponse<JwtUserResponse>> {
        try {
            const user = await DBUser.db.getOne({_id: new ObjectID(req.user.id), isTemp: true});
            if (user) {
                user.username = model.username;
                user.isTemp = false;
                let userModel = DBUser.toUserModel(user);
                let jwt = await this.authService.createToken(userModel);
                return SuccessResponse.success({jwt: jwt, user: userModel});
            } else {
                return SuccessResponse.fail();
            }
        } catch (ex) {
            console.error(ex);
            return SuccessResponse.fail();
        }
    }

    @UseGuards(AuthGuard)
    @Get('/')
    async getUserDetails(@Req() req: {user: UserModel}): Promise<SuccessResponse<JwtUserResponse>> {
        try {
            const user = await DBUser.db.getOne({_id: new ObjectID(req.user.id), isTemp: true});
            if (user) {
                let userModel = DBUser.toUserModel(user);
                let jwt = await this.authService.createToken(userModel);
                return SuccessResponse.success({jwt: jwt, user: userModel});
            } else {
                return SuccessResponse.fail();
            }
        } catch (ex) {
            console.error(ex);
            return SuccessResponse.fail();
        }
    }
}
