/**
 *
 * ./routes/autores.js
 * @fileoverview Rutas API de la tabla autores 
 * 
 */

/**
 * IMPORTS
 */
const express = require('express');
const { uploadAutores } = require('../middleware/multer.js');
const { read, readById, createAuthor } = require('../controller/autores.js');

const router = express.Router()

/**
 * PATHS
 */
router.get('/', read);
router.get('/:id', readById);
router.post('/registrar', uploadAutores.single('imagen'), createAuthor);

module.exports = router;