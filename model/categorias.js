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
// Get todas las categorías
const get = () => pool.query('SELECT * FROM categorias ORDER BY categoria ASC');

const getCategory = (id) => pool.query('SELECT * FROM categorias WHERE id = $1', [id]);

// Creación de nueva categoría
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

// Remover categoría
const remove = async (id) => {
    try {
        const result = await pool.query(`DELETE FROM categorias WHERE id = $1`, [id]);
        return result;
    } catch(error) {
        throw err;
    }
}

module.exports = {
    get,
    getCategory,
    create,
    remove
};