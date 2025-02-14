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

const router = express.Router();

/**
 * PATHS
 */
router.get('/', read);
router.get('/:id', readUser);

module.exports = router;