import {MongoDocument} from './mongoDocument';
import {DocumentManager} from '../dataManager';
import {GameConfig} from '@common/models/game/gameConfig';
import {ObjectID} from 'bson';
import {DBUser} from './dbUser';
import {UserModel} from '@common/models/user/userModel';

export class DBLiveGame extends MongoDocument {
    static collectionName = 'live-game';
    static db = new DocumentManager<DBLiveGame>(DBLiveGame.collectionName);
    gameId: string;
    gameServerAddress: string;
    users: UserModel[];
}
