/**
 *
 * ./model/libros.js
 * @fileoverview Modelo de las rutas de libros (MVC Model View Controller)
 * 
 */

const pool = require('./database.js');
const fs = require('fs');
const path = require('path');

const get = () => pool.query(`
    SELECT 
        l.id AS libro_id,
        l.titulo AS libro_titulo,
        l.descripcion AS libro_descripcion,
        l.precio AS libro_precio,
        l.cantidad AS libro_cantidad,
        l.paginas AS libro_paginas,
        l.imagen AS libro_imagen,
        JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
    			'id', a.id,
    			'nombre', a.nombre,
    			'apellidos', a.apellidos
				)) AS autores,
        JSONB_AGG(DISTINCT c.categoria) AS categorias
    FROM libros l
    JOIN libros_autores la ON l.id = la.libro_id
    JOIN autores a ON la.autor_id = a.id
    JOIN libros_categorias lc ON l.id = lc.libro_id
    JOIN categorias c ON lc.categoria_id = c.id
    GROUP BY 
        l.id, 
        l.titulo, 
        l.descripcion, 
        l.precio, 
        l.cantidad, 
        l.paginas, 
        l.imagen
    ORDER BY l.id;
`);

const getById = (id) => pool.query(`
    SELECT 
        l.id AS libro_id,
        l.titulo AS libro_titulo,
        l.descripcion AS libro_descripcion,
        l.precio AS libro_precio,
        l.cantidad AS libro_cantidad,
        l.paginas AS libro_paginas,
        l.imagen AS libro_imagen,
        JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
    			'id', a.id,
    			'nombre', a.nombre,
    			'apellidos', a.apellidos
				)) AS autores,
        JSONB_AGG(DISTINCT c.categoria) AS categorias
    FROM libros l
    JOIN libros_autores la ON l.id = la.libro_id
    JOIN autores a ON la.autor_id = a.id
    JOIN libros_categorias lc ON l.id = lc.libro_id
    JOIN categorias c ON lc.categoria_id = c.id
    WHERE l.id = $1
    GROUP BY 
        l.id, 
        l.titulo, 
        l.descripcion, 
        l.precio, 
        l.cantidad, 
        l.paginas, 
        l.imagen
    ORDER BY l.id;
`, [id]);

const create = async (body, imageName) => {
    try {
        const result = await pool.query(
            `INSERT INTO libros (titulo, descripcion, precio, cantidad, paginas, imagen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [body.titulo, body.descripcion, body.precio, body.cantidad, body.paginas, `http://localhost:8000/imagenes/libros/${imageName}`]
        );
        return result
    } catch (err) {
        console.error("Error al insertar libro:", err);
        throw err;
    }
};

const update = async (id, body) => {
    try {
        const result = await pool.query(
            `UPDATE libros SET titulo = $1, descripcion = $2, precio = $3, cantidad = $4, paginas = $5 WHERE id = $6 RETURNING *`,
            [body.titulo, body.descripcion, body.precio, body.cantidad, body.paginas, id]
        );

        return result
    } catch (err) {
        console.error("Error al actualizar libro:", err);
        throw err;
    }
};

const updateImage = async (id, imageName) => {
    try {
        // Borrado de la antigua Imagen
        const oldImageQuery = await pool.query(`SELECT imagen FROM libros WHERE id = $1`, [id]);
        if (oldImageQuery.rows.length > 0) {
            // Obtiene la URL de la imagen antigua
            const oldImagePath = oldImageQuery.rows[0].imagen;

            // Extrae el path de la imagen antigua de la URL
            const oldFileName = path.basename(oldImagePath);
            const filePath = path.join(__dirname, '..', 'public', 'imagenes', 'libros', oldFileName);
            console.log(filePath);

            // Elimina imagen antigua
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
            }
        }

        // Subida de la nueva Imagen
        const result = await pool.query(
            `UPDATE libros SET imagen = $1 WHERE id = $2 RETURNING *`,
            [`http://localhost:8000/imagenes/libros/${imageName}`, id]
        );

        return result
    } catch (err) {
        console.error("Error al actualizar libro:", err);
        throw err;
    }
}

const assignAuthor = async (libroId, autorId) => {
    try {
        const result = await pool.query(
            `INSERT INTO libros_autores (libro_id, autor_id) VALUES ($1, $2) RETURNING *`,
            [libroId, autorId]
        );
        return result;
    } catch (error) {
        console.log(err);
        throw err;
    }
};

const updateAuthor = async (libroId, autorOldId, autorNewId) => {
    try {
        const result = await pool.query(
            `UPDATE libros_autores SET autor_id = $1 WHERE libro_id = $2 AND autor_id = $3 RETURNING *`,
            [ autorNewId, libroId, autorOldId ]
        );
        return result;
    } catch (error) {
        console.log(err);
        throw err;
    }
}
const removeAuthor = async (libroId, autorId) => {
    try {
        const result = pool.query(
            `DELETE FROM libros_autores WHERE libro_id = $1 AND autor_id = $2`,
            [ libroId, autorId ]
        );
        return result;
    } catch (error) {
        console.log(err)
        throw err;
    }
}

const remove = async (id) => {
    try {
        const result = await pool.query(`DELETE FROM libros WHERE id = $1`, [id]);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    get,
    getById,
    create,
    update,
    updateImage,
    assignAuthor,
    updateAuthor,
    removeAuthor,
    remove
};