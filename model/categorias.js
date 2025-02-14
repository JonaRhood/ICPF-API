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
const get = () => pool.query('SELECT * FROM categorias');

const getUser = (userId) => pool.query('SELECT * FROM categorias WHERE id = $1', [userId]);

// Creación de nuevo usuario
const create = async (body) => {
    try {
        const result = await pool.query(
            'INSERT INTO categorias (categoria) VALUES ($1) RETURNING *',
            [body.categoria]
        );
        return result;
    } catch (err) {
        throw err;
    }
};

// const remove = async (id) => {
//     try {

//     }
// }

module.exports = {
    get,
    getUser,
    create,
};