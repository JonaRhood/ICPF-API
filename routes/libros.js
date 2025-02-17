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
    read, readById, readByName, createBook,
    updateBook, updateBookImage, deleteBookById, 
    addAuthor, updateNewAuthor, removeAuthorFromBook, 
    addCategory, updateNewCategory, removeCategoryFromBook
} = require('../controller/libros.js');

const router = express.Router()

/**
 * PATHS
 */
router.get('/', read);
router.get('/buscar', readByName);
router.get('/:id', readById);
router.post('/', imageProcessor('libros'), createBook);
router.post('/autor', addAuthor);
router.post('/categoria', addCategory);
router.put('/autor', updateNewAuthor);
router.put('/categoria', updateNewCategory);
router.put('/:id/imagen', imageProcessor('libros'), updateBookImage);
router.put('/:id', updateBook);
router.delete('/autor', removeAuthorFromBook);
router.delete('/categoria', removeCategoryFromBook);
router.delete('/:id', deleteBookById)

module.exports = router;