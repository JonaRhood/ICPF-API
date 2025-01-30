const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(client => {
    console.log('Conectado a la Base de Datos');
    client.release();
  })
  .catch(err => console.error('Error al conectarse a la Base de Datos'));

module.exports = pool;
