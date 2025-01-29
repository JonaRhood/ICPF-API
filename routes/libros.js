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
const { read } = require('../controller/libros.js');

const router = express.Router();

/**
 * PATHS
 */
router.get('/libros', read);

module.exports = router;