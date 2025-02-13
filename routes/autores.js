/**
 *
 * ./routes/autores.js
 * @fileoverview Rutas API de la tabla autores 
 * 
 */

"use strict";

/**
 * IMPORTS
 */
const express = require('express');
const { processImage, uploadAuthors } = require('../middleware/multer.js');
const { 
    read, readById, readByName, createAuthor, 
    updateAuthor, updateAuthorImage, deleteAuthorById 
} = require('../controller/autores.js');

const router = express.Router()

/**
 * PATHS
 */
router.get('/', read);
router.get('/buscar', readByName);
router.get('/:id', readById);
router.post('/', processImage, createAuthor);
router.put('/:id', updateAuthor);
router.put('/:id/imagen', uploadAuthors.single('imagen'), updateAuthorImage);
router.delete('/:id', deleteAuthorById)

module.exports = router;