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
} = require('../model/usuarios.js');

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

exports.readUser = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await getUser(id);
        return res.json(task.rows);
    } catch (err) {  
        return res.status(400).json({ error: err.detail });
    }
};