import mongodb from '../config/mongodb';
import { Collection } from 'mongodb';

interface Level {
  level: number;
  bins: string[];
}

interface Rack {
  rack: string;
  levels: Level[];
}

interface Layout {
  aisle: string;
  racks: Rack[];
}

interface Metadata {
  tempControlled: boolean;
}

interface WarehouseLocation {
  _id?: string;
  warehouse_id: number;
  code: string;
  layout: Layout[];
  metadata: Metadata;
  created_at?: Date;
  updated_at?: Date;
}

export class LocationModel {
  private static collection: Collection<WarehouseLocation>;

  private static getCollection(): Collection<WarehouseLocation> {
    if (!this.collection) {
      this.collection = mongodb.getCollection<WarehouseLocation>('locations');
    }
    return this.collection;
  }

  static async findByWarehouseId(warehouseId: number): Promise<WarehouseLocation | null> {
    const result = await this.getCollection().findOne({ warehouse_id: warehouseId });
    return result || null;
  }

  static async create(locationData: Omit<WarehouseLocation, '_id' | 'created_at' | 'updated_at'>): Promise<WarehouseLocation> {
    const now = new Date();
    const dataToInsert = {
      ...locationData,
      created_at: now,
      updated_at: now
    };

    const result = await this.getCollection().insertOne(dataToInsert);
    return { 
      _id: result.insertedId.toString(),
      ...dataToInsert 
    };
  }

  static async update(warehouseId: number, updateData: Partial<WarehouseLocation>): Promise<WarehouseLocation | null> {
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date()
    };

    const result = await this.getCollection().findOneAndUpdate(
      { warehouse_id: warehouseId },
      { $set: dataToUpdate },
      { returnDocument: 'after' }
    );

    return result || null;
  }

  static async binExists(binCode: string): Promise<{ exists: boolean; location?: any }> {
    const location = await this.getCollection().findOne({
      'layout.racks.levels.bins': binCode
    });

    if (!location) {
      return { exists: false };
    }

    for (const layout of location.layout) {
      for (const rack of layout.racks) {
        for (const level of rack.levels) {
          const binExists = level.bins.includes(binCode);
          if (binExists) {
            return {
              exists: true,
              location: {
                warehouseId: location.warehouse_id,
                aisleCode: layout.aisle,
                rackCode: rack.rack,
                levelNumber: level.level,
                binCode: binCode
              }
            };
          }
        }
      }
    }

    return { exists: false };
  }

  static async createSampleStructure(warehouseId: number): Promise<WarehouseLocation> {
    const sampleData: Omit<WarehouseLocation, '_id' | 'created_at' | 'updated_at'> = {
      warehouse_id: warehouseId,
      code: "WH5-001",
      layout: [
        {
          aisle: "A1",
          racks: [
            {
              rack: "R1",
              levels: [
                {
                  level: 1,
                  bins: ["A1-R1-L1-B01", "A1-R1-L1-B02"]
                }
              ]
            }
          ]
        }
      ],
      metadata: {
        tempControlled: true
      }
    };

    return await this.create(sampleData);
  }

  static async findAll(): Promise<WarehouseLocation[]> {
    return await this.getCollection().find({}).toArray();
  }

  static async findById(id: string): Promise<WarehouseLocation | null> {
    const result = await this.getCollection().findOne({ _id: id });
    return result || null;
  }
}
