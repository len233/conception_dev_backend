import { MongoClient, Db, Collection, Document } from 'mongodb';
import config from './config';

class MongoDatabase {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(config.mongodb.uri);
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db();
      
      await this.initializeCollections();
    } catch (error) {
      throw error;
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Base de données MongoDB non initialisée');
    }
    return this.db;
  }

  public getCollection<T extends Document = any>(collectionName: string): Collection<T> {
    return this.getDb().collection<T>(collectionName);
  }

  public async close(): Promise<void> {
    await this.client.close();
  }

  private async initializeCollections(): Promise<void> {
    try {
      const db = this.getDb();

      const locationsCollection = db.collection('locations');
      
      await locationsCollection.createIndex({ warehouse_id: 1 }, { unique: true });
      
      await locationsCollection.createIndex({ 'zones.aisles.levels.bins.code': 1 });

    } catch (error) {
      throw error;
    }
  }

  public async ping(): Promise<boolean> {
    try {
      await this.client.db('admin').command({ ping: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new MongoDatabase();
