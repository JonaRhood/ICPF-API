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
const { imageProcessor } = require("../middleware/imageProcessor.js")
const { 
    read, readById, createBook,
    updateBook, updateBookImage, deleteBookById
} = require('../controller/libros.js');

const router = express.Router()

/**
 * PATHS
 */
router.get('/', read);
router.get('/:id', readById);
router.post('/', imageProcessor('libros'), createBook);
router.put('/:id', updateBook);
router.put('/:id/imagen', imageProcessor('libros'), updateBookImage);
router.delete('/:id', deleteBookById)

module.exports = router;