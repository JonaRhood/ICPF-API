/**
 *
 * ./routes/categorias.js
 * @fileoverview Rutas API de la tabla categorias
 * 
 */

/**
 * IMPORTS
 */
const express = require('express');
const { 
    read, readCategory, createCategory,
    removeCategory
} = require('../controller/categorias.js');

const router = express.Router();

/**
 * PATHS
 */
router.get('/', read);
router.get('/:id', readCategory);
router.post('/', createCategory);
router.delete('/:id', removeCategory);


module.exports = router;