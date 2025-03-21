/**
 *
 * ./controller/autores.js
 * @fileoverview Controladores de las rutas de autores (MVC Model View Controller)
 * 
 */

"use strict";

const {
    get, getById, getByName,
    create, update, updateImage, remove
} = require('../model/autores.js');

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
        if (task.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Autor no encontrado" });
        }
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

exports.readByName = async (req, res) => {
    const apellidos = req.query.apellidos;
    if (apellidos === null || apellidos === "") {
        return res.status(404).json({ success: false, error: "Falta añadir apellido" })
    }
    try {
        const task = await getByName(apellidos);
        if (task.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Autor no encontrado" });
        }
        return res.json(task.rows);
    } catch (err) {
        return res.status(400).json({ error: err });
    }
}

exports.createAuthor = async (req, res) => {
    const imageUrl = req.file.url;

    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se ha enviado ninguna imagen' });
    }

    try {
        const task = await create(req.body, imageUrl);
        return res.status(201).json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
};

exports.updateAuthor = async (req, res) => {
    const id = req.params.id;

    try {
        const task = await update(id, req.body);
        return res.status(200).json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
}

exports.updateAuthorImage = async (req, res) => {
    const imageUrl = req.file.url;
    const id = req.params.id

    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se ha enviado ninguna imagen' });
    }

    try {
        const task = await updateImage(id, imageUrl);
        return res.json(task.rows)
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
};

exports.deleteAuthorById = async (req, res) => {
    const id = req.params.id;

    try {
        const task = await remove(id);
        if (task.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Autor no encontrado" });
        }
        return res.status(200).send("Autor Eliminado");
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
}