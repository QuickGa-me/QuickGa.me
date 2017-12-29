import {DataManager} from '@serverCommon/db/dataManager';
import {GameServer} from './gameServer';

async function bootstrap() {
    let port = parseInt(process.env.PORT || '7888');
    console.log(`Connecting to database`);
    await DataManager.openDbConnection();
    console.log(`Serving Game Server started on port ${port}`);

    new GameServer(port);
}

bootstrap().catch(er => console.error(er));