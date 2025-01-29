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
const librosRoutes = require('./routes/libros');

/**
 * INICIALIZACION DEL SERVIDOR
 */
const app = express();
const port = 3000;

/**
 * MIDDLEWARE PARA SERVIR ARCHIVOS ESTÁTICOS
 */
app.use(express.static(path.join(__dirname, 'public')));

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