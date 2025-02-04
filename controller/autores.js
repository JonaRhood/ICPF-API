/**
 *
 * ./controller/autores.js
 * @fileoverview Controladores de las rutas de autores (MVC Model View Controller)
 * 
 */

const { get, getById, create } = require('../model/autores.js');

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

exports.createAuthor = async (req, res) => {
    const imageName = req.file.filename;
    console.log(req.body, imageName);

    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se ha enviado ninguna imagen' });
    }
    
    try {
        const task = await create(req.body, imageName);
        return res.json(task.rows)
    } catch(err) {
        return res.status(400).json({ error: err.detail });
    }
};