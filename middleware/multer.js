/**
 *
 * ./middleware/multer.js
 * @fileoverview Middleware para gestionar la subida de archivos en el servidor
 * 
 */

"use strict";

const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { fileURLToPath } = require('url');
const busboy = require('busboy');

const processImage = (req, res, next) => {
    const bb = busboy({ headers: req.headers });

    req.body = {};
    let fileProcessed = false; 

    bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const webpFilePath = path.join(__dirname, '..', 'public', 'imagenes', 'autores', uniqueName + '.webp');

        const transformStream = sharp().webp();

        file.pipe(transformStream)
            .pipe(fs.createWriteStream(webpFilePath))
            .on('finish', () => {
                console.log('Archivo WebP guardado:', webpFilePath);
                req.file = {
                    path: webpFilePath.replace(path.join(__dirname, '..', 'public'), ''),
                    filename: uniqueName + '.webp',
                    fieldname: fieldname
                };
                fileProcessed = true;
                checkIfFinished();
            })
            .on('error', (err) => {
                console.error('Error en la conversión:', err);
                if (fs.existsSync(webpFilePath)) {
                    fs.unlinkSync(webpFilePath);
                }
                next(err);
            });

        file.on('limit', () => {
            const err = new Error('Tamaño del archivo excedido.');
            err.status = 413;
            next(err);
        });
    });

    bb.on('field', (fieldname, value) => {
        req.body[fieldname] = value;
    });

    bb.on('finish', () => {
        console.log('Subida de archivo completada.');
        checkIfFinished();
    });

    bb.on('error', (err) => {
        console.error('Error en la subida:', err);
        next(err);
    });

    req.pipe(bb);

    function checkIfFinished() {
        if (fileProcessed) {
            next(); 
        }
    }
};


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
    processImage,
    uploadAuthors,
    uploadLibros
};