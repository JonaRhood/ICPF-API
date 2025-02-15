/**
 *
 * ./controller/libros.js
 * @fileoverview Controladores de las rutas de usuarios (MVC Model View Controller)
 * 
 */

/**
 * IMPORTS
 */
const { 
    get, 
    getCategory, 
    create, 
    remove
} = require('../model/categorias.js');

/**
 * CONTROLADORES
 */
// GET de todas las categorías
exports.read = async (req, res) => {
    try {
        const task = await get();
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
};

// GET categoría por id
exports.readCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await getCategory(id);
        return res.json(task.rows);
    } catch (err) {  
        return res.status(400).json({ error: err.detail });
    }
};

// POST categoria
exports.createCategory = async (req, res) => {
    try {
        const task = await create(req.body);
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err.detail })
    };
}

// DELETE categoria
exports.removeCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await remove(id);
        return res.json(task.rows);
    } catch(err) {
        res.status(400).json({ error: err.detail });
    }
}