/**
 *
 * ./controller/libros.js
 * @fileoverview Controladores de las rutas de libros (MVC Model View Controller)
 * 
 */

const {
    get, getById, getByName, getByColumn, create,
    update, updateImage, remove, assignAuthor,
    updateAuthor, removeAuthors, assignCategory,
    updateCategory, removeCategories,
} = require('../model/libros.js');

// GET libros
exports.read = async (req, res) => {
    try {
        const task = await get();
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

// GET libro por id
exports.readById = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await getById(id);
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

exports.readByName = async (req, res) => {
    const titulo = req.query.titulo;
    if (titulo === null || titulo === "") {
        return res.status(404).json({ success: false, error: "Falta añadir apellido" })
    }
    try {
        const task = await getByName(titulo);
        if (task.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Autor no encontrado" });
        }
        return res.json(task.rows);
    } catch (error) {
        return res.status(400).json({ error: err });
    }
}

exports.readByColumn = async (req, res) => {
    const column = req.query.columna;
    const type = req.query.tipo;

    const validColumns = ['l.titulo', 'l.precio', 'l.cantidad', 'l.paginas'];
    const validTypes = ['ASC', 'DESC'];

    if (!validColumns.includes(column)) {
        return res.status(400).json({ error: "Columna no válida" });
    }

    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: "Tipo de orden no válido" });
    }

    try {
        const task = await getByColumn(column, type);
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};


// POST libro
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

// PUT libro
exports.updateBook = async (req, res) => {
    const id = req.params.id;

    try {
        const task = await update(id, req.body);
        return res.status(200).json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
}

// PUT imagen libro
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

// DELETE libro
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

// POST autor a libro
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

// PUT autor a libro
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

// DELETE autor de libro
exports.removeAuthorsFromBook = async (req, res) => {
    const libroId = req.query.libro;
    try {
        const task = await removeAuthors(libroId);
        return res.status(200).send("Autor Removido");
    } catch (err) {
        return res.status(404).json({ error: err.detail })
    }
}

// POST autor a libro
exports.addCategory = async (req, res) => {
    const libroId = req.query.libro;
    const categoriaId = req.query.categoria;

    try {
        const task = await assignCategory(libroId, categoriaId);
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err.detail })
    }
}

// PUT autor a libro
exports.updateNewCategory = async (req, res) => {
    const libroId = req.query.libro;
    const categoriaOldId = req.query.categoria;
    const categoriaNewId = req.query.nueva_categoria;
    console.log(libroId, categoriaOldId, categoriaNewId);

    try {
        const task = await updateCategory(libroId, categoriaOldId, categoriaNewId);
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err.detail })
    }
}

// DELETE autor de libro
exports.removeCategoriesFromBook = async (req, res) => {
    const libroId = req.query.libro;
    try {
        const task = await removeCategories(libroId);
        return res.status(200).send("Categoria Removida");
    } catch (err) {
        return res.status(404).json({ error: err.detail })
    }
}