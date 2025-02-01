/**
 *
 * ./routes/libros.js
 * @fileoverview Rutas API de la tabla libros 
 * 
 */

/**
 * IMPORTS
 */
const express = require('express');
const { 
    read, 
    readUser,
} = require('../controller/usuarios.js');

const usuarios = express.Router();

/**
 * PATHS
 */
usuarios.get('/', read);
usuarios.get('/:id', readUser);

module.exports = usuarios;