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
    getUser, 
    create, 
} = require('../model/categorias.js');

/**
 * CONTROLADORES
 */
// Get de todos los usuarios
exports.read = async (req, res) => {
    try {
        const task = await get();
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
};

exports.readCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await getUser(id);
        return res.json(task.rows);
    } catch (err) {  
        return res.status(400).json({ error: err.detail });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const task = await create(req.body);
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err.detail })
    };
}