/**
 *
 * ./controller/libros.js
 * @fileoverview Controladores de las rutas de usuarios (MVC Model View Controller)
 * 
 */

/**
 * IMPORTS
 */
const bcrypt = require('bcrypt');
const { get, create } = require('../model/usuarios.js');

/**
 * CONTROLADORES
 */
// Get de todos los usuarios
exports.read = async (req, res) => {
    try {
        const task = await get();
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};


const saltRounds = 12;
// Creación de Nuevo Usuario
exports.createUser = async (req, res) => {
    try {
        // Encriptación de la contraseña
        const salt = await bcrypt.genSalt(saltRounds);
        const pass = await bcrypt.hash(req.body.contraseña, salt);
        req.body.contraseña = pass;
        // Creación de nuevo usuario
        const task = await create(req.body);
        return res.status(201).send(`Usuario con nuevo id ${task.rows[0].id} creado`);
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

