import postgres from '../config/postgres';
import { ProductModel } from './Product';

interface Movement {
  id?: number;
  type: 'IN' | 'OUT';
  quantity: number;
  product_id: number;
  created_at?: Date;
}

interface MovementFilters {
  product_id?: number;
  type?: 'IN' | 'OUT';
  date_from?: string;
  date_to?: string;
  start_date?: Date;
  end_date?: Date;
}

interface CreateMovementRequest {
  type: 'IN' | 'OUT';
  quantity: number;
  product_id: number;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class MovementModel {

  static async findAll(
    filters?: MovementFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResponse<Movement & { product_name?: string; product_reference?: string; warehouse_name?: string }>> {
    
    let whereClause = '';
    const values: any[] = [];
    let paramCount = 1;

    const conditions = [];

    if (filters?.product_id) {
      conditions.push(`m.product_id = $${paramCount}`);
      values.push(filters.product_id);
      paramCount++;
    }

    if (filters?.type) {
      conditions.push(`m.type = $${paramCount}`);
      values.push(filters.type);
      paramCount++;
    }

    if (filters?.start_date) {
      conditions.push(`m.created_at >= $${paramCount}`);
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters?.end_date) {
      conditions.push(`m.created_at <= $${paramCount}`);
      values.push(filters.end_date);
      paramCount++;
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 50;
    const offset = (page - 1) * limit;
    
    const sortBy = pagination?.sortBy || 'created_at';
    const sortOrder = pagination?.sortOrder || 'DESC';

    const countResult = await postgres.query(`
      SELECT COUNT(*) as total 
      FROM movements m 
      LEFT JOIN products p ON m.product_id = p.id
      LEFT JOIN warehouses w ON p.warehouse_id = w.id
      ${whereClause}
    `, values);

    const total = parseInt(countResult.rows[0].total);

    const dataResult = await postgres.query(`
      SELECT 
        m.id, m.type, m.quantity, m.product_id, m.created_at,
        p.name as product_name,
        p.reference as product_reference,
        w.name as warehouse_name
      FROM movements m 
      LEFT JOIN products p ON m.product_id = p.id
      LEFT JOIN warehouses w ON p.warehouse_id = w.id
      ${whereClause}
      ORDER BY m.${sortBy} ${sortOrder}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `, [...values, limit, offset]);

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  static async findById(id: number): Promise<Movement | null> {
    const result = await postgres.query(`
      SELECT 
        m.id, m.type, m.quantity, m.product_id, m.created_at,
        p.name as product_name,
        p.reference as product_reference,
        w.name as warehouse_name
      FROM movements m 
      LEFT JOIN products p ON m.product_id = p.id
      LEFT JOIN warehouses w ON p.warehouse_id = w.id
      WHERE m.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  static async create(movementData: CreateMovementRequest): Promise<Movement> {
    const client = await postgres.getPool().connect();
    
    try {
      await client.query('BEGIN');

      const product = await ProductModel.findById(movementData.product_id);
      if (!product) {
        throw new Error(`Produit avec l'ID ${movementData.product_id} non trouvé`);
      }

      let newQuantity: number;
      if (movementData.type === 'IN') {
        newQuantity = product.quantity + movementData.quantity;
      } else { 
        newQuantity = product.quantity - movementData.quantity;
        if (newQuantity < 0) {
          throw new Error(`Stock insuffisant. Stock actuel: ${product.quantity}, demande: ${movementData.quantity}`);
        }
      }

      const movementResult = await client.query(`
        INSERT INTO movements (type, quantity, product_id) 
        VALUES ($1, $2, $3) 
        RETURNING id, type, quantity, product_id, created_at
      `, [movementData.type, movementData.quantity, movementData.product_id]);

      await client.query(`
        UPDATE products 
        SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
      `, [newQuantity, movementData.product_id]);

      await client.query('COMMIT');
      return movementResult.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByProduct(productId: number): Promise<Movement[]> {
    const result = await postgres.query(`
      SELECT id, type, quantity, product_id, created_at
      FROM movements 
      WHERE product_id = $1
      ORDER BY created_at DESC
    `, [productId]);
    return result.rows;
  }

  static async findToday(): Promise<Movement[]> {
    const result = await postgres.query(`
      SELECT 
        m.id, m.type, m.quantity, m.product_id, m.created_at,
        p.name as product_name,
        p.reference as product_reference,
        w.name as warehouse_name
      FROM movements m 
      LEFT JOIN products p ON m.product_id = p.id
      LEFT JOIN warehouses w ON p.warehouse_id = w.id
      WHERE DATE(m.created_at) = CURRENT_DATE
      ORDER BY m.created_at DESC
    `);
    return result.rows;
  }

  static async getStats(startDate?: Date, endDate?: Date): Promise<{
    total_movements: number;
    total_in: number;
    total_out: number;
    quantity_in: number;
    quantity_out: number;
  }> {
    let whereClause = '';
    const params: any[] = [];

    if (startDate && endDate) {
      whereClause = 'WHERE created_at BETWEEN $1 AND $2';
      params.push(startDate, endDate);
    } else if (startDate) {
      whereClause = 'WHERE created_at >= $1';
      params.push(startDate);
    } else if (endDate) {
      whereClause = 'WHERE created_at <= $1';
      params.push(endDate);
    }

    const result = await postgres.query(`
      SELECT 
        COUNT(*) as total_movements,
        COUNT(CASE WHEN type = 'IN' THEN 1 END) as total_in,
        COUNT(CASE WHEN type = 'OUT' THEN 1 END) as total_out,
        COALESCE(SUM(CASE WHEN type = 'IN' THEN quantity ELSE 0 END), 0) as quantity_in,
        COALESCE(SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END), 0) as quantity_out
      FROM movements 
      ${whereClause}
    `, params);

    const stats = result.rows[0];
    return {
      total_movements: parseInt(stats.total_movements) || 0,
      total_in: parseInt(stats.total_in) || 0,
      total_out: parseInt(stats.total_out) || 0,
      quantity_in: parseInt(stats.quantity_in) || 0,
      quantity_out: parseInt(stats.quantity_out) || 0,
    };
  }

  static async delete(id: number): Promise<boolean> {
    const result = await postgres.query(`
      DELETE FROM movements WHERE id = $1
    `, [id]);
    return result.rowCount > 0;
  }

  static async exists(id: number): Promise<boolean> {
    const result = await postgres.query(`
      SELECT 1 FROM movements WHERE id = $1
    `, [id]);
    return result.rows.length > 0;
  }
}
