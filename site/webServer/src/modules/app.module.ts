import {Module, RequestMethod, NestModule} from '@nestjs/common';
import {MiddlewaresConsumer} from '@nestjs/common/interfaces/middlewares';
import {CorsMiddleware} from '../middleware/corsMiddleware';

import {CheckController} from './controllers/checkController';
import {GameController} from './controllers/gameController';

import {AuthService} from './auth/auth.service';
import {UserController} from './controllers/userController';
import {JwtStrategy} from './auth/passport/jwtStragegy';

@Module({
    modules: [],
    components: [AuthService, JwtStrategy],
    controllers: [GameController, UserController, CheckController]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(CorsMiddleware).forRoutes({path: '/*', method: RequestMethod.ALL});
    }
}
