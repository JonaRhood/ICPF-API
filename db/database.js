const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function verificarConexion(reintentos = 5, delay = 2000) {
  for (let intento = 1; intento <= reintentos; intento++) {
    try {
      const client = await pool.connect();
      console.log('✅ Conectado a la Base de Datos');
      client.release();
      return;
    } catch (err) {
      console.error(`❌ Intento ${intento} de ${reintentos} - Error al conectarse a la Base de Datos:`, err.message);

      if (intento === reintentos) {
        console.error('💥 No se pudo establecer conexión tras varios intentos. Cerrando aplicación.');
        process.exit(1);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

verificarConexion();
