import {DataManager} from '@serverCommon/db/dataManager';
import {GameServer} from './gameServer';
import {PubSub} from '@serverCommon/pubSub';
import {DBGame} from '@serverCommon/db/models/dbGame';

async function bootstrap() {
    let port = parseInt(process.env.PORT || '7888');
    console.log(`Connecting to database`);
    await DataManager.openDbConnection();
    console.log(`Serving Game Server started on port ${port}`);
    await PubSub.start();
    new GameServer(port);
}

bootstrap().catch(er => console.error(er));
