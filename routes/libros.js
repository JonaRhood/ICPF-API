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
    read, readById, readByName, readByColumn,
    createBook, updateBook, updateByQuantity, 
    updateBookImage, deleteBookById, addAuthor, 
    updateNewAuthor, removeAuthorsFromBook, addCategory, 
    updateNewCategory, removeCategoriesFromBook
} = require('../controller/libros.js');

const router = express.Router()

/**
 * PATHS
 */
router.get('/', read);
router.get('/buscar', readByName);
router.get('/columna', readByColumn);
router.get('/:id', readById);
router.post('/', imageProcessor('libros'), createBook);
router.post('/autor', addAuthor);
router.post('/categoria', addCategory);
router.put('/autor', updateNewAuthor);
router.put('/categoria', updateNewCategory);
router.put('/cantidad', updateByQuantity);
router.put('/:id/imagen', imageProcessor('libros'), updateBookImage);
router.put('/:id', updateBook);
router.delete('/autor', removeAuthorsFromBook);
router.delete('/categoria', removeCategoriesFromBook);
router.delete('/:id', deleteBookById)

module.exports = router;