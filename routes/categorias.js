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
const { librarySuperUserAuthenticatedAPI } = require("../middleware/middleware.js");
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
router.post('/', librarySuperUserAuthenticatedAPI, createCategory);
router.delete('/:id', librarySuperUserAuthenticatedAPI, removeCategory);


module.exports = router;