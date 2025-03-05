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
const { librarySuperUserAuthenticatedAPI } = require("../middleware/middleware.js");
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
router.post('/', librarySuperUserAuthenticatedAPI, imageProcessor('libros'), createBook);
router.post('/autor', librarySuperUserAuthenticatedAPI, addAuthor);
router.post('/categoria', librarySuperUserAuthenticatedAPI, addCategory);
router.put('/autor', librarySuperUserAuthenticatedAPI, updateNewAuthor);
router.put('/categoria', librarySuperUserAuthenticatedAPI, updateNewCategory);
router.put('/cantidad', librarySuperUserAuthenticatedAPI, updateByQuantity);
router.put('/:id/imagen', librarySuperUserAuthenticatedAPI, imageProcessor('libros'), updateBookImage);
router.put('/:id', librarySuperUserAuthenticatedAPI, updateBook);
router.delete('/autor', librarySuperUserAuthenticatedAPI, removeAuthorsFromBook);
router.delete('/categoria', librarySuperUserAuthenticatedAPI, removeCategoriesFromBook);
router.delete('/:id', librarySuperUserAuthenticatedAPI, deleteBookById)

module.exports = router;