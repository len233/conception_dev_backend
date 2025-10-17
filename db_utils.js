const { Client } = require('pg');
require('dotenv').config();

const DB_CONFIG = {
  host: 'localhost',
  user: process.env.dbuser || 'postgres',         
  password: process.env.dbpwd || 'default_password', 
  database: 'mabase',
  port: 5433
};

function getConnection(username, password, database) {
  return new Client({
    host: 'localhost',
    user: username || DB_CONFIG.user,
    password: password || DB_CONFIG.password,
    database: database || DB_CONFIG.database,
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
      console.error('erreur récupération :', err.message);
      callback(err, null);
    })
    .finally(() => client.end());
}

function insert_user(user, callback) {
  const client = getConnection(DB_CONFIG.user, DB_CONFIG.password, DB_CONFIG.database);
  
  client.connect()
    .then(() => client.query('INSERT INTO users (email) VALUES ($1) RETURNING *', [user.email]))
    .then(res => {
      console.log('utilisateur ajouté :', res.rows[0]);
      if (callback) callback(null, res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.error('erreur insertion :', err.message);
      if (callback) callback(err, null);
      throw err;
    })
    .finally(() => client.end());
}

function runTests() {
  console.log('tests');
  
  getUsers((err, users) => {
    if (!err) console.table(users);
  });
  
  const testUser = { email: `test-${Date.now()}@exemple.com` };
  insert_user(testUser, (err, result) => {
    if (!err) {
      console.log('test insertion réussi');
      setTimeout(() => getUsers((err, users) => {
        if (!err) {
          console.log('liste finale :');
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