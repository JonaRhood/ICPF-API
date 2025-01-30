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
const { read, createUser } = require('../controller/usuarios.js');

const usuarios = express.Router();

/**
 * PATHS
 */
usuarios.get('/usuarios', read);
usuarios.post('/usuarios', createUser);

module.exports = usuarios;