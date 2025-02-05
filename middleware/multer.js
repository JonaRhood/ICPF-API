/**
 *
 * ./middleware/multer.js
 * @fileoverview Middleware para gestionar la subida de archivos en el servidor
 * 
 */

const multer = require('multer');
const path = require('path');

const storageAuthors = multer.diskStorage({
    destination: 'public/imagenes/autores',
    filename: (req, file, cb) => { 
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);
        cb(null, uniqueName + extension);
    }
});

const storageLibros = multer.diskStorage({
    destination: 'public/imagenes/libros',
    filename: (req, file, cb) => { 
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname);
        cb(null, uniqueName + extension);
    }
});

const uploadAuthors = multer({ storage: storageAuthors });
const uploadLibros = multer({ storage: storageLibros });

module.exports = {
    uploadAuthors,
    uploadLibros
};