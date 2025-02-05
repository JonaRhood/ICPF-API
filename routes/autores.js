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
const { uploadAuthors } = require('../middleware/multer.js');
const { 
    read, readById, createAuthor, updateAuthor, updateAuthorImage, 
    deleteAuthorById 
} = require('../controller/autores.js');

const router = express.Router()

/**
 * PATHS
 */
router.get('/', read);
router.get('/:id', readById);
router.post('/', uploadAuthors.single('imagen'), createAuthor);
router.put('/:id', updateAuthor);
router.put('/:id/imagen', uploadAuthors.single('imagen'), updateAuthorImage);
router.delete('/:id', deleteAuthorById)

module.exports = router;