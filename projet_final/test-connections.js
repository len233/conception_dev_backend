const { Pool } = require('./node_modules/@types/pg');
const { MongoClient } = require('mongodb');
require('dotenv').config();

console.log('Test des connexions StockLink Core API\n');

async function testPostgreSQL() {
  console.log('Test PostgreSQL...');
  
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'stocklink',
    user: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
  });

  try {
    const client = await pool.connect();
    
    const version = await client.query('SELECT version()');
    console.log('Connexion réussie');
    
    const tables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    console.log('  Tables trouvées:', tables.rows.map(r => r.tablename).join(', '));
    
    await client.query(`
      INSERT INTO warehouses (name, location) 
      VALUES ('Entrepôt Test', 'Paris') 
      ON CONFLICT DO NOTHING
    `);
    
    const warehouseCount = await client.query('SELECT COUNT(*) FROM warehouses');
    console.log('Nombre d\'entrepôts:', warehouseCount.rows[0].count);
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log('Erreur PostgreSQL:', error.message);
    return false;
  }
}

async function testMongoDB() {
  console.log('\nTest MongoDB...');
  
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stocklink_locations';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('Connexion réussie');
    
    const db = client.db();
    console.log('Base de données:', db.databaseName);
    
    const collection = db.collection('test_locations');
    
    await collection.insertOne({
      warehouse_id: 1,
      zones: [{
        code: 'TEST',
        name: 'Zone Test',
        aisles: []
      }],
      created_at: new Date()
    });
    
    const count = await collection.countDocuments();
    console.log('Documents de test:', count);
    
    await collection.deleteMany({});
    
    await client.close();
    return true;
  } catch (error) {
    console.log('Erreur MongoDB:', error.message);
    return false;
  }
}


async function main() {
  const pgResult = await testPostgreSQL();
  const mongoResult = await testMongoDB();
  
  console.log('\nRésultats:');
  console.log(`PostgreSQL: ${pgResult ? 'OK' : 'ECHEC'}`);
  console.log(`MongoDB: ${mongoResult ? 'OK' : 'ECHEC'}`);
  
  if (pgResult && mongoResult) {
    console.log('\nToutes les bases sont connectées et fonctionnelles !');
    console.log('L\'API StockLink Core peut démarrer correctement.');
    process.exit(0);
  } else {
    console.log('\nDes problèmes de connexion détectés');
    process.exit(1);
  }
}

main().catch(console.error);
