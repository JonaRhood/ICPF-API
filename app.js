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
const librosRoutes = require('./routes/libros');

/**
 * INICIALIZACION DEL SERVIDOR
 */
const app = express();
const port = 3000;

/**
 * PATHS
 */
app.use('/api', librosRoutes)

/**
 * LISTENER
 */
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});