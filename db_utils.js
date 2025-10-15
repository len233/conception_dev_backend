const { Client } = require('pg');

const DB_CONFIG = {
  host: 'localhost',
  user: 'postgres',
  password: 'cactus4705', 
  database: 'mabase',
  port: 5433
};

function getConnection(username, password, database) {
  return new Client({
    host: 'localhost',
    user: username,
    password: password,
    database: database,
    port: 5433
  });
}

function getUsers(callback) {
  const client = getConnection(DB_CONFIG.user, DB_CONFIG.password, DB_CONFIG.database);
  
  client.connect()
    .then(() => client.query('SELECT * FROM users'))
    .then(res => {
      console.log(`${res.rows.length} utilisateur(s) trouvé(s)`);
      callback(null, res.rows);
    })
    .catch(err => {
      console.error('Erreur récupération :', err.message);
      callback(err, null);
    })
    .finally(() => client.end());
}

function insert_user(user, callback) {
  const client = getConnection(DB_CONFIG.user, DB_CONFIG.password, DB_CONFIG.database);
  
  client.connect()
    .then(() => client.query('INSERT INTO users (email) VALUES ($1) RETURNING *', [user.email]))
    .then(res => {
      console.log('Utilisateur ajouté :', res.rows[0]);
      if (callback) callback(null, res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.error('Erreur insertion :', err.message);
      if (callback) callback(err, null);
      throw err;
    })
    .finally(() => client.end());
}

function runTests() {
  console.log('Tests');
  
  getUsers((err, users) => {
    if (!err) console.table(users);
  });
  
  const testUser = { email: `test-${Date.now()}@exemple.com` };
  insert_user(testUser, (err, result) => {
    if (!err) {
      console.log('Test insertion réussi');
      setTimeout(() => getUsers((err, users) => {
        if (!err) {
          console.log('Liste finale :');
          console.table(users);
        }
      }), 500);
    }
  });
}

if (require.main === module) {
  runTests();
}

module.exports = { getConnection, getUsers, insert_user };