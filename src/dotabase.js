const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'study',
  user: 'postgres',
  password: '181915smv',
});

client.connect();

client.query('SELECT * FROM users', (err, res) => {
  if (err) throw err;
  console.log(res.rows);
  client.end();
}
);