import postgres from '../config/postgres';

interface Product {
  id?: number;
  name: string;
  reference: string;
  quantity: number;
  warehouse_id: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ProductFilters {
  warehouse_id?: number;
  min_quantity?: number;
  max_quantity?: number;
  name?: string;
  reference?: string;
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

export class ProductModel {

  static async findAll(
    filters?: ProductFilters, 
    pagination?: PaginationOptions
  ): Promise<PaginatedResponse<Product>> {
    
    let whereClause = '';
    const values: any[] = [];
    let paramCount = 1;

    const conditions = [];

    if (filters?.warehouse_id) {
      conditions.push(`p.warehouse_id = $${paramCount}`);
      values.push(filters.warehouse_id);
      paramCount++;
    }

    if (filters?.name) {
      conditions.push(`p.name ILIKE $${paramCount}`);
      values.push(`%${filters.name}%`);
      paramCount++;
    }

    if (filters?.reference) {
      conditions.push(`p.reference ILIKE $${paramCount}`);
      values.push(`%${filters.reference}%`);
      paramCount++;
    }

    if (filters?.min_quantity !== undefined) {
      conditions.push(`p.quantity >= $${paramCount}`);
      values.push(filters.min_quantity);
      paramCount++;
    }

    if (filters?.max_quantity !== undefined) {
      conditions.push(`p.quantity <= $${paramCount}`);
      values.push(filters.max_quantity);
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
      FROM products p 
      LEFT JOIN warehouses w ON p.warehouse_id = w.id 
      ${whereClause}
    `, values);

    const total = parseInt(countResult.rows[0].total);

    const dataResult = await postgres.query(`
      SELECT 
        p.id, p.name, p.reference, p.quantity, p.warehouse_id,
        p.created_at, p.updated_at,
        w.name as warehouse_name
      FROM products p 
      LEFT JOIN warehouses w ON p.warehouse_id = w.id 
      ${whereClause}
      ORDER BY p.${sortBy} ${sortOrder}
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

  static async findById(id: number): Promise<Product | null> {
    const result = await postgres.query(`
      SELECT 
        p.id, p.name, p.reference, p.quantity, p.warehouse_id,
        p.created_at, p.updated_at,
        w.name as warehouse_name
      FROM products p 
      LEFT JOIN warehouses w ON p.warehouse_id = w.id 
      WHERE p.id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  static async findByReference(reference: string): Promise<Product | null> {
    const result = await postgres.query(`
      SELECT 
        p.id, p.name, p.reference, p.quantity, p.warehouse_id,
        p.created_at, p.updated_at,
        w.name as warehouse_name
      FROM products p 
      LEFT JOIN warehouses w ON p.warehouse_id = w.id 
      WHERE p.reference = $1
    `, [reference]);
    return result.rows[0] || null;
  }

  static async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const result = await postgres.query(`
      INSERT INTO products (name, reference, quantity, warehouse_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, reference, quantity, warehouse_id, created_at, updated_at
    `, [product.name, product.reference, product.quantity, product.warehouse_id]);
    return result.rows[0];
  }

  static async update(id: number, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (product.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(product.name);
      paramCount++;
    }

    if (product.reference !== undefined) {
      fields.push(`reference = $${paramCount}`);
      values.push(product.reference);
      paramCount++;
    }

    if (product.quantity !== undefined) {
      fields.push(`quantity = $${paramCount}`);
      values.push(product.quantity);
      paramCount++;
    }

    if (product.warehouse_id !== undefined) {
      fields.push(`warehouse_id = $${paramCount}`);
      values.push(product.warehouse_id);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await postgres.query(`
      UPDATE products 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING id, name, reference, quantity, warehouse_id, created_at, updated_at
    `, values);

    return result.rows[0] || null;
  }

  static async updateQuantity(id: number, newQuantity: number): Promise<Product | null> {
    const result = await postgres.query(`
      UPDATE products 
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING id, name, reference, quantity, warehouse_id, created_at, updated_at
    `, [newQuantity, id]);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await postgres.query(`
      DELETE FROM products WHERE id = $1
    `, [id]);
    return result.rowCount > 0;
  }

  static async exists(id: number): Promise<boolean> {
    const result = await postgres.query(`
      SELECT 1 FROM products WHERE id = $1
    `, [id]);
    return result.rows.length > 0;
  }

  static async referenceExists(reference: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT 1 FROM products WHERE reference = $1';
    const params = [reference];

    if (excludeId) {
      query += ' AND id != $2';
      params.push(excludeId.toString());
    }

    const result = await postgres.query(query, params);
    return result.rows.length > 0;
  }

  static async findByWarehouse(warehouseId: number): Promise<Product[]> {
    const result = await postgres.query(`
      SELECT 
        p.id, p.name, p.reference, p.quantity, p.warehouse_id,
        p.created_at, p.updated_at
      FROM products p 
      WHERE p.warehouse_id = $1
      ORDER BY p.name ASC
    `, [warehouseId]);
    return result.rows;
  }

  static async findOutOfStock(warehouseId?: number): Promise<Product[]> {
    let query = `
      SELECT 
        p.id, p.name, p.reference, p.quantity, p.warehouse_id,
        p.created_at, p.updated_at,
        w.name as warehouse_name
      FROM products p 
      LEFT JOIN warehouses w ON p.warehouse_id = w.id 
      WHERE p.quantity = 0
    `;
    
    const params: any[] = [];
    if (warehouseId) {
      query += ' AND p.warehouse_id = $1';
      params.push(warehouseId);
    }

    query += ' ORDER BY p.name ASC';

    const result = await postgres.query(query, params);
    return result.rows;
  }
}
