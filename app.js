'use strict'
/**
 * IMPORTS
 */
const express = require('express');

/**
 * INICIALIZACIONES
 */
const app = express();
const puerto = 3000;

/**
 * PATHS
 */
app.get('/', (req, res, next) => {
    res.send("Hola");
});

/**
 * LISTENER
 */
app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});