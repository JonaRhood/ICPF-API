/**
 *
 * ./controller/libros.js
 * @fileoverview Controladores de las rutas de libros (MVC Model View Controller)
 * 
 */

const { get } = require('../model/libros.js');

exports.read = async (req, res) => {
    try {
        const task = await get();
        return res.json({ data: task.rows })
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};