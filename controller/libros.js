/**
 *
 * ./controller/libros.js
 * @fileoverview Controladores de las rutas de libros (MVC Model View Controller)
 * 
 */

const { 
    get, getById, create,
    update, updateImage, assignAuthor,
    updateAuthor, removeAuthor, remove
 } = require('../model/libros.js');

exports.read = async (req, res) => {
    try {
        const task = await get();
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

exports.readById = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await getById(id);
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};


exports.createBook = async (req, res) => {
    const imageName = req.file.filename;

    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se ha enviado ninguna imagen' });
    }

    try {
        const task = await create(req.body, imageName);
        return res.status(201).json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
};

exports.updateBook = async (req, res) => {
    const id = req.params.id;

    try {
        const task = await update(id, req.body);
        return res.status(200).json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
}

exports.updateBookImage = async (req, res) => {
    const imageName = req.file.filename;
    const id = req.params.id

    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se ha enviado ninguna imagen' });
    }

    try {
        const task = await updateImage(id, imageName);
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
};

exports.addAuthor = async (req, res) => {
    const libroId = req.query.libro;
    const autorId = req.query.autor;

    try {
        const task = await assignAuthor(libroId, autorId);
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err.detail })
    }
}

exports.updateNewAuthor = async (req, res) => {
    const libroId = req.query.libro;
    const autorOldId = req.query.autor;
    const autorNewId = req.query.nuevo_autor;
    console.log(libroId, autorOldId, autorNewId);

    try {
        const task = await updateAuthor(libroId, autorOldId, autorNewId);
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err.detail })
    }
}

exports.removeAuthorFromBook = async (req, res) => {
    const libroId = req.query.libro;
    const autorId = req.query.autor;
    
    try {
        const task = await removeAuthor(libroId, autorId);
        return res.status(200).send("Autor Removido");
    } catch (err) {
        return res.status(404).json({ error: err.detail })
    }
}

exports.deleteBookById = async (req, res) => {
    const id = req.params.id;

    try {
        const task = await remove(id);
        if (task.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Autor no encontrado" });
        }
        return res.status(200).send("Libro Eliminado");
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
}