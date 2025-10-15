const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',     
  password: 'cactus4705', 
  database: 'mabase',     
  port: 5433
});

client.connect()
  .then(() => console.log('Connecté à PostgreSQL !'))
  .then(() => client.query('SELECT * FROM users'))
  .then(res => console.table(res.rows))
  .catch(err => console.error('Erreur :', err))
  .finally(() => client.end());


app.get('/users-from-db', (req, res) => {
    const client = getConnection('postgres', 'cactus4705', 'mabase');
    getUsers(client, (err, users) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(users);
        }
    });
}); 
