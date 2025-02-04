/**
 *
 * ./controller/libros.js
 * @fileoverview Controladores de las rutas de libros (MVC Model View Controller)
 * 
 */

const { get, getById } = require('../model/libros.js');

exports.read = async (req, res) => {
    try {
        const task = await get();
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

exports.readById = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await getById(id);
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};