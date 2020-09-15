import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './modules/app.module';
import {DataManager} from '@serverCommon/db/dataManager';
import {PubSub} from '@serverCommon/pubSub';

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);
    let port = parseInt(process.env.PORT || '3000');
    console.log(`Connecting to database`);
    await DataManager.openDbConnection();
    console.log(`Connecting to redis`);
    await PubSub.start();
    console.log(`Serving started on port ${port}`);
    await app.listen(port, '0.0.0.0');
}

bootstrap().catch(er => console.error(er));
