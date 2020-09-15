import {Cursor, Db, IndexOptions, MongoClient, ObjectId} from 'mongodb';
import {Config} from '../../config/config';
import {AwsService} from '../awsService';
import {SafeFilterQuery, MongoAltQuery, QuerySelector, UpdateQuery2} from './typeSafeFilter';
import {Utils} from '@common/utils';

let mongoClient: MongoClient | undefined;
let firstTime = true;
let retries = 0;
export class DataManager {
  static async dbConnection(): Promise<Db> {
    // console.log('getting connection');

    if (!mongoClient || !mongoClient.isConnected()) {
      if (!firstTime) {
        // await AwsService.sendDebugEmail('dbConnection hot but disconnected', `${new Date()} `);
        console.log('dbConnection hot but disconnected');
        await this.disconnectDB();
      } else {
        console.log('dbConnection cold');
        firstTime = false;
      }
      try {
        mongoClient = await MongoClient.connect(Config.mongoConnectionString, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          loggerLevel: 'warn',
          logger: (e, b) => console.log(b, e),
        });
        console.log('connected');
      } catch (ex) {
        console.error('dbConnection error');
        console.error(ex);
        await AwsService.sendDebugEmail('db connection error', `${new Date()} retries: ${retries}` + ex.toString());
        retries++;
        if (retries > 3) {
          throw new Error(`An unexpected error has occurred.`);
        }
        await Utils.timeout(1000);
        return this.dbConnection();
      }
    } else {
      // console.log('db connection hot');
    }
    return mongoClient.db(Config.mongoDbName);
  }
  static async disconnectDB() {
    try {
      if (mongoClient) {
        await mongoClient.close();
        mongoClient = undefined;
      }
    } catch (ex) {
      console.error('disconnect db error', ex);
    }
  }
}

type FlattenArray<T> = {
  [key in keyof T]: T[key] extends Array<infer J> ? Array<FlattenArray<J>> & FlattenArray<J> : FlattenArray<T[key]>;
};

export class DocumentManager<T extends {_id: ObjectId}> {
  constructor(public collectionName: string) {}

  async aggregate<TAgg>(query: any): Promise<TAgg[]> {
    return (await DataManager.dbConnection()).collection(this.collectionName).aggregate(query).toArray();
  }

  async count(query: SafeFilterQuery<T>): Promise<number> {
    return await (await this.getCollection()).countDocuments(query, {});
  }

  async deleteMany(query: SafeFilterQuery<T>): Promise<void> {
    await (await this.getCollection()).deleteMany(query);
  }
  async deleteOne(query: SafeFilterQuery<T>): Promise<void> {
    await (await this.getCollection()).deleteOne(query);
  }

  async ensureIndex(spec: any, options: IndexOptions): Promise<string> {
    console.log('ensure index');
    const s = await (await this.getCollection()).createIndex(spec, options);
    console.log('ensured index');
    return s;
  }

  async exists(query: SafeFilterQuery<T>): Promise<boolean> {
    return (await (await this.getCollection()).count(query, {})) > 0;
  }

  async getAll(query: SafeFilterQuery<T>): Promise<T[]> {
    return (await (await this.getCollection()).find(query)).toArray();
  }

  async getAllCursor(
    query: SafeFilterQuery<T>,
    sortKey: keyof T | null,
    sortDirection: number,
    page: number,
    take: number
  ): Promise<Cursor<T>> {
    let cursor = (await this.getCollection()).find(query);
    if (sortKey) {
      cursor = cursor.sort(sortKey as string, sortDirection);
    }
    return cursor.skip(page * take).limit(take);
  }

  async getAllPaged(
    query: SafeFilterQuery<T>,
    sortKey: keyof T | null,
    sortDirection: number,
    page: number,
    take: number
  ): Promise<T[]> {
    let cursor = (await this.getCollection()).find(query);
    if (sortKey) {
      cursor = cursor.sort(sortKey as string, sortDirection);
    }
    return (await cursor.skip(page * take).limit(take)).toArray();
  }

  async getAllProject<
    TOverride extends {[key in keyof T]: T[key]} = {[key in keyof T]: T[key]},
    TProjection extends {[key in keyof TOverride]?: 1 | -1} = {[key in keyof TOverride]?: 1 | -1},
    TKeys extends keyof TProjection & keyof TOverride = keyof T
  >(query: SafeFilterQuery<T>, projection: TProjection): Promise<{[key in TKeys]: TOverride[key]}[]> {
    // console.time(`getting all`);
    const items = (
      await (await DataManager.dbConnection()).collection(this.collectionName).find(query).project(projection)
    ).toArray();
    // console.timeEnd(`getting all`);
    return items;
  }

  async getById(id: string | ObjectId, projection?: any): Promise<T | null> {
    const objectId: ObjectId = typeof id === 'string' ? ObjectId.createFromHexString(id) : id;
    if (projection) {
      return (await DataManager.dbConnection()).collection(this.collectionName).findOne({_id: objectId}, {projection});
    } else {
      return (await DataManager.dbConnection()).collection(this.collectionName).findOne({_id: objectId});
    }
  }

  async getCollection() {
    return (await DataManager.dbConnection()).collection<T>(this.collectionName);
  }

  async getOne(query: SafeFilterQuery<T>): Promise<T | undefined> {
    const result = await (await this.getCollection()).findOne(query);
    return result ?? undefined;
  }

  async getOneProject<
    TOverride extends {[key in keyof T]: T[key]} = {[key in keyof T]: T[key]},
    TProjection extends {[key in keyof TOverride]?: 1 | -1} = {[key in keyof TOverride]?: 1 | -1},
    TKeys extends keyof TProjection & keyof TOverride = keyof T
  >(query: SafeFilterQuery<T>, projection: TProjection): Promise<{[key in TKeys]: TOverride[key]} | undefined> {
    const item = await (await DataManager.dbConnection()).collection(this.collectionName).findOne(query, {projection});
    return item ?? undefined;
  }

  async insertDocument(document: Omit<T, '_id'>): Promise<T> {
    // console.log('inserting');
    const result = await (await this.getCollection()).insertOne(document as any);
    // console.log('inserted');
    const idDocument = document as T;
    idDocument._id = result.insertedId;
    // console.log('inserted got id  ');
    return idDocument;
  }

  async insertDocuments(documents: Omit<T, '_id'>[]): Promise<T[]> {
    const result = await (await this.getCollection()).insertMany(documents as any);
    for (let i = 0; i < documents.length; i++) {
      (documents[i] as T)._id = result.insertedIds[i];
    }
    return documents as T[];
  }
  keyFilter<T2>(
    query: (t: FlattenArray<T>) => T2,
    value: MongoAltQuery<T2> | QuerySelector<MongoAltQuery<T2>>
  ): SafeFilterQuery<T> {
    const keyList: PropertyKey[] = [];
    const handler: any = {
      get(target: any, key: PropertyKey, receiver: any): any {
        keyList.push(key);
        return new Proxy({[key]: {}}, handler);
      },
    };
    const proxy = new Proxy({} as FlattenArray<T>, handler);

    query(proxy);
    return {[keyList.join('.')]: value} as any;
  }
  keySet<T2>(query: (t: FlattenArray<T>) => T2, value: T2): Partial<T> {
    const keyList: PropertyKey[] = [];
    const handler: any = {
      get(target: any, key: PropertyKey, receiver: any): any {
        keyList.push(key);
        return new Proxy({[key]: {}}, handler);
      },
    };
    const proxy = new Proxy({} as FlattenArray<T>, handler);

    query(proxy);
    return {[keyList.join('.')]: value} as any;
  }
  keySort<T2>(query: (t: FlattenArray<T>) => T2): keyof T {
    const keyList: PropertyKey[] = [];
    const handler: any = {
      get(target: any, key: PropertyKey, receiver: any): any {
        keyList.push(key);
        return new Proxy({[key]: {}}, handler);
      },
    };
    const proxy = new Proxy({} as FlattenArray<T>, handler);

    query(proxy);
    return keyList.join('.') as keyof T;
  }

  async updateDocument(document: T): Promise<T> {
    // console.log('getting update collection ', this.collectionName);
    const collection = await this.getCollection();

    // console.log('updating', this.collectionName);
    await collection.findOneAndReplace({_id: document._id} as any, document);
    // console.log('update', this.collectionName);
    return document;
  }

  async updateMany(filter: SafeFilterQuery<T>, update: UpdateQuery2<T> | T): Promise<void> {
    await (await this.getCollection()).updateMany(filter, update as any);
  }

  async updateOne(filter: SafeFilterQuery<T>, update: UpdateQuery2<T> | T): Promise<void> {
    await (await this.getCollection()).updateOne(filter, update as any);
  }
}
