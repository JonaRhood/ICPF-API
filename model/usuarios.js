/**
 *
 * ./model/userRegistration.js
 * @fileoverview Modelo de las rutas para el registro de usuarios (MVC Model View Controller)
 * 
 */

/**
 * IMPORTS
 */
const pool = require('./database.js');

/**
 * MODELOS
 */
// Get todos los usuarios
const get = () => pool.query('SELECT nombre, apellidos, email, imagen, nacimiento FROM usuarios');

const getUser = (userId) => pool.query('SELECT nombre, apellidos, email, imagen, nacimiento FROM usuarios WHERE id = $1', [userId]);

// Creación de nuevo usuario
const create = async (body) => {
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, apellidos, email, contraseña, nacimiento) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [body.nombre, body.apellidos, body.email, body.contraseña, body.nacimiento]
        );
        return result;
    } catch (err) {
        console.error("Error en el Modelo", err)
        throw err;
    }
};

module.exports = {
    get,
    getUser,
    create,
};