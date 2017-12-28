import {Module, RequestMethod, NestModule} from '@nestjs/common';
import {MiddlewaresConsumer} from "@nestjs/common/interfaces/middlewares";
import {CorsMiddleware} from "../middleware/corsMiddleware";

import {CheckController} from "./controllers/checkController";
import {GameController} from "./controllers/gameController";

@Module({
    modules: [],
    controllers: [GameController,CheckController]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(CorsMiddleware).forRoutes({path: '/*', method: RequestMethod.ALL});
    }
}