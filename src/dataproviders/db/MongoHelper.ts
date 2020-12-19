import { Collection, MongoClient, ObjectId } from "mongodb";
import { appConfig } from "../../config";

type MongoObjectId = { _id: ObjectId };

export const mongoHelper = {
  client: null as MongoClient,
  url: appConfig.mongodb.url,
  dbName: appConfig.mongodb.dbName,

  async connect(url: string, dbName?: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    if (dbName) {
      this.dbName = dbName;
      this.client.db(dbName);
    }
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
    this.dbName = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.url, this.dbName);
    }

    return this.client.db(this.dbName).collection(name);
  },

  map: (data: Partial<MongoObjectId>): object => {
    const {_id, ...rest} = data;

    return Object.assign({}, rest, {id: _id});
  },

  mapCollection: (collection: Array<unknown>): Array<unknown> => {
    return collection.map((c) => mongoHelper.map(c));
  }
};
