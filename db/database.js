const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(client => {
    console.log('Conectado a la Base de Datos');
    client.release();
  })
  .catch(err => console.error('Error al conectarse a la Base de Datos', err));

module.exports =  pool;
