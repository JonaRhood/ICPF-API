/**
 *
 * ./model/libros.js
 * @fileoverview Modelo de las rutas de libros (MVC Model View Controller)
 * 
 */

const pool = require('./database.js');

const get = () => pool.query('SELECT * FROM libros');

module.exports = {
    get,
};