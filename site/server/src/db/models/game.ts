import {MongoDocument} from "./mongoDocument";
import {DocumentManager} from "../dataManager";

export class Game extends MongoDocument {
    static collectionName = 'game';
    static db = new DocumentManager<Game>(Game.collectionName);

    gameName: string;
    clientSource: string;
    serverSource: string;
    gameConfig: string;
}
