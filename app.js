/**
 *
 * app.js
 * @fileoverview Configuraciones principales del servidor
 * 
 */

/**
 * IMPORTS
 */
const express = require('express');
const path = require('path');
const librosRoutes = require('./routes/libros.js');
const usuariosRoutes = require('./routes/usuarios.js');
const pool = require('./model/database.js');
require('dotenv').config();

/**
 * INICIALIZACION DEL SERVIDOR
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * MIDDLEWARE
 */
// Middleware para servir archivos estáticos desde la carpeta /public
app.use(express.static(path.join(__dirname, 'public')));
// Middleware para habilitar el soporte JSON en las solicitudes
app.use(express.json());
// Middleware para habilitar el soporte para formularios
app.use(express.urlencoded({ extended: true }));

/**
 * COMPROBACIÓN DE SALUD DEL SERVIDOR
 */
app.get('/health', (req, res) => {
    res.sendStatus(200);
});

/**
 * PATHS
 */
app.use('/api', librosRoutes);
app.use('/api', usuariosRoutes)

// app.get("/libros", async (req, res) => {
//     try {
//       const result = await pool.query('SELECT * FROM libros');
//       res.json(result.rows);  // Enviar los datos obtenidos en formato JSON
//     } catch (error) {
//       console.error('Error ejecutando la consulta:', error);
//       res.status(500).json({ error: 'Error en el servidor' });
//     }
// });

/**
 * LISTENER
 */
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});