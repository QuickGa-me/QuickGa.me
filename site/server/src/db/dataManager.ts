import {Db,  MongoClient} from "mongodb";
import {MongoDocument} from "@common/models/db/mongoDocument";
import {Config} from "../config";


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

    public static async insertDocument<T extends MongoDocument>(document: T, collectionName: string): Promise<T> {
        let result = (await this.dbConnection.collection(collectionName).insertOne(document));
        document._id = result.insertedId;
        return document;
    }

    public static async updateDocument<T extends MongoDocument>(document: T, collectionName: string): Promise<T> {
        (await this.dbConnection.collection(collectionName).findOneAndUpdate({_id: document._id}, document));
        return document;
    }

    public static async getOne<T extends MongoDocument>(collectionName: string, query: Object = {}): Promise<T> {
        return await this.dbConnection.collection(collectionName).findOne(query);
    }

    public static async getAll<T extends MongoDocument>(collectionName: string, query: Object = {}): Promise<T[]> {
        return (await this.dbConnection.collection(collectionName).find(query)).toArray();
    }

    public static async count<T extends MongoDocument>(collectionName: string, query: Object = {}): Promise<number> {
        return (await this.dbConnection.collection(collectionName).count(query));
    }

}