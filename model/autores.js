/**
 *
 * ./model/autores.js
 * @fileoverview Modelo de las rutas de autores (MVC Model View Controller)
 * 
 */

"use strict";

const pool = require('../db/database.js');
require("dotenv").config()
const { deleteImageFromSupabase } = require("../middleware/imageProcessor.js");

const get = () => pool.query(`
    SELECT
        a.id AS autor_id,
        a.nombre AS autor_nombre,
        a.apellidos AS autor_apellidos,
        a.imagen AS autor_imagen,
        a.descripcion AS autor_descripcion,
        COALESCE(
            JSON_AGG(
                CASE 
                    WHEN l.id IS NOT NULL THEN 
                        JSON_BUILD_OBJECT('id', l.id, 'titulo', l.titulo)
                    ELSE NULL
                END
            ) FILTER (WHERE l.id IS NOT NULL), 
            '[]' 
        ) AS libros
    FROM autores a
    LEFT JOIN libros_autores la ON a.id = la.autor_id
    LEFT JOIN libros l ON la.libro_id = l.id
    GROUP BY a.id, a.nombre, a.apellidos, a.imagen, a.descripcion
    ORDER BY a.id;
`);

const getById = (id) => pool.query(`
    SELECT
        a.id AS autor_id,
        a.nombre AS autor_nombre,
        a.apellidos AS autor_apellidos,
        a.imagen AS autor_imagen,
        a.descripcion AS autor_descripcion,
        COALESCE(
            JSON_AGG(
                CASE 
                    WHEN l.id IS NOT NULL THEN 
                        JSON_BUILD_OBJECT(
                            'id', l.id, 
                            'titulo', l.titulo,
                            'imagen', l.imagen
                        )
                    ELSE NULL
                END
            ) FILTER (WHERE l.id IS NOT NULL), 
            '[]' 
        ) AS libros
    FROM autores a
    LEFT JOIN libros_autores la ON a.id = la.autor_id
    LEFT JOIN libros l ON la.libro_id = l.id
    WHERE a.id = $1
    GROUP BY a.id, a.nombre, a.apellidos, a.imagen, a.descripcion
    ORDER BY a.id;
`, [id]);

const getByName = (apellidos) => pool.query(
    `SELECT id, nombre, apellidos FROM autores WHERE apellidos ILIKE $1`,
    [`%${apellidos}%`]
);

const create = async (body, imageUrl) => {
    try {
        const result = await pool.query(
            `INSERT INTO autores (nombre, apellidos, imagen, descripcion) VALUES ($1, $2, $3, $4) RETURNING *`,
            [body.nombre, body.apellidos, imageUrl, body.descripcion]
        );
        return result
    } catch (err) {
        console.error("Error al insertar autor:", err);
        throw err;
    }
};

const update = async (id, body) => {
    try {
        const result = await pool.query(
            `UPDATE autores SET nombre = $1, apellidos = $2, descripcion = $3 WHERE id = $4 RETURNING *`,
            [body.nombre, body.apellidos, body.descripcion, id]
        );

        return result
    } catch (err) {
        console.error("Error al actualizar autor:", err);
        throw err;
    }
};

const updateImage = async (id, imageUrl) => {
    try {
        const { rows } = await pool.query(`SELECT imagen FROM autores WHERE id = $1`, [id]);
        const oldImageUrl = rows[0]?.imagen;

        if (oldImageUrl) {
            await deleteImageFromSupabase(oldImageUrl);
        }

        // Subida de la nueva Imagen
        const result = await pool.query(
            `UPDATE autores SET imagen = $1 WHERE id = $2 RETURNING *`,
            [imageUrl, id]
        );

        return result
    } catch (err) {
        console.error("Error al actualizar autor:", err);
        throw err;
    }
}

const remove = async (id) => {
    try {
        const result = await pool.query(`DELETE FROM autores WHERE id = $1`, [id]);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    get,
    getById,
    getByName,
    create,
    update,
    updateImage,
    remove
};