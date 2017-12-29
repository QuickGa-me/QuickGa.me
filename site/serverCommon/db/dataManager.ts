import {Db, MongoClient} from 'mongodb';
import {Config} from '../config';
import {MongoDocument} from './models/mongoDocument';
import {ObjectID} from 'bson';

export class DataManager {
    static dbConnection: Db;

    public static async openDbConnection() {
        if (!this.dbConnection) {
            this.dbConnection = (await MongoClient.connect(Config.db)).db('qg');
        }
    }

    public static async closeDbConnection() {
        if (this.dbConnection) {
            await this.dbConnection.close();
            this.dbConnection = undefined!;
        }
    }
}

export class DocumentManager<T extends MongoDocument> {
    constructor(private collectionName: string) {}

    public async insertDocument(document: T): Promise<T> {
        let result = await DataManager.dbConnection.collection(this.collectionName).insertOne(document);
        document._id = result.insertedId;
        return document;
    }

    public async updateDocument(document: T): Promise<T> {
        DataManager.dbConnection.collection(this.collectionName).findOneAndUpdate({_id: document._id}, document);
        return document;
    }

    public async getOne(query: Object = {}): Promise<T> {
        return await DataManager.dbConnection.collection(this.collectionName).findOne(query);
    }

    public async getById(id: string): Promise<T> {
        return await DataManager.dbConnection.collection(this.collectionName).findOne({_id: new ObjectID(id)});
    }

    public async getAll(query: Object = {}): Promise<T[]> {
        return (await DataManager.dbConnection.collection(this.collectionName).find(query)).toArray();
    }

    public async count(query: Object = {}): Promise<number> {
        return await DataManager.dbConnection.collection(this.collectionName).count(query);
    }
}
