import {MongoDocument} from './mongoDocument';
import {DocumentManager} from '../dataManager';
import {GameConfig} from '@common/models/game/gameConfig';

export class DBGame extends MongoDocument {
    static collectionName = 'game';
    static db = new DocumentManager<DBGame>(DBGame.collectionName);

    gameName: string;
    clientSource?: string;
    serverSource?: string;
    gameConfig?: GameConfig;
}
