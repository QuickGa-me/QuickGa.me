import {DataManager} from '@serverCommon/db/dataManager';
import {LobbyServer} from './lobbyServer';

async function bootstrap() {
    let port = parseInt(process.env.PORT || '7898');
    console.log(`Connecting to database`);
    await DataManager.openDbConnection();
    console.log(`Serving Lobby started on port ${port}`);

    new LobbyServer(port);
}

bootstrap().catch(er => console.error(er));
