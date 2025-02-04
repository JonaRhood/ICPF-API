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
const { read, readById } = require('../controller/libros.js');

const router = express.Router()

/**
 * PATHS
 */
router.get('/', read);
router.get('/:id', readById);

module.exports = router;