import postgres from '../config/postgres';

interface Warehouse {
  id?: number;
  name: string;
  location: string;
}

export class WarehouseModel {

  static async findAll(): Promise<Warehouse[]> {
    const query = 'SELECT id, name, location FROM warehouses ORDER BY name';
    const result = await postgres.query(query);
    return result.rows;
  }

  static async findById(id: number): Promise<Warehouse | null> {
    const query = 'SELECT id, name, location FROM warehouses WHERE id = $1';
    const result = await postgres.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  static async create(warehouseData: Omit<Warehouse, 'id'>): Promise<Warehouse> {
    const query = `
      INSERT INTO warehouses (name, location) 
      VALUES ($1, $2) 
      RETURNING id, name, location
    `;
    
    const result = await postgres.query(query, [
      warehouseData.name,
      warehouseData.location
    ]);
    
    return result.rows[0];
  }

  static async update(id: number, warehouseData: Partial<Omit<Warehouse, 'id'>>): Promise<Warehouse | null> {
    const setClause: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (warehouseData.name !== undefined) {
      setClause.push(`name = $${paramCount}`);
      values.push(warehouseData.name);
      paramCount++;
    }

    if (warehouseData.location !== undefined) {
      setClause.push(`location = $${paramCount}`);
      values.push(warehouseData.location);
      paramCount++;
    }

    if (setClause.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE warehouses 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, name, location
    `;

    const result = await postgres.query(query, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM warehouses WHERE id = $1';
    const result = await postgres.query(query, [id]);
    return result.rowCount > 0;
  }

  static async exists(id: number): Promise<boolean> {
    const query = 'SELECT 1 FROM warehouses WHERE id = $1';
    const result = await postgres.query(query, [id]);
    return result.rows.length > 0;
  }

  static async getProductCount(warehouseId: number): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM products WHERE warehouse_id = $1';
    const result = await postgres.query(query, [warehouseId]);
    return parseInt(result.rows[0].count);
  }

  static async getTotalStock(warehouseId: number): Promise<number> {
    const query = 'SELECT SUM(quantity) as total FROM products WHERE warehouse_id = $1';
    const result = await postgres.query(query, [warehouseId]);
    return parseInt(result.rows[0].total) || 0;
  }
}

export type { Warehouse };