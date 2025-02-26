/**
 *
 * ./model/libros.js
 * @fileoverview Modelo de las rutas de libros (MVC Model View Controller)
 * 
 */

const pool = require('./database.js');
const fs = require('fs');
const path = require('path');
require("dotenv").config()

// GET libros
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
        JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id', c.id,
            'categoria', c.categoria
        )) AS categorias
    FROM libros l
    LEFT JOIN libros_autores la ON l.id = la.libro_id
    LEFT JOIN autores a ON la.autor_id = a.id
    LEFT JOIN libros_categorias lc ON l.id = lc.libro_id
    LEFT JOIN categorias c ON lc.categoria_id = c.id
    GROUP BY 
        l.id, 
        l.titulo, 
        l.descripcion, 
        l.precio, 
        l.cantidad, 
        l.paginas, 
        l.imagen
    ORDER BY l.titulo ASC;
`);

// GET libro por id
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
        JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id', c.id,
            'categoria', c.categoria
        )) AS categorias
    FROM libros l
    LEFT JOIN libros_autores la ON l.id = la.libro_id
    LEFT JOIN autores a ON la.autor_id = a.id
    LEFT JOIN libros_categorias lc ON l.id = lc.libro_id
    LEFT JOIN categorias c ON lc.categoria_id = c.id
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

const getByName = (titulo) => pool.query(
    `SELECT id, titulo FROM libros WHERE titulo ILIKE $1`,
    [`%${titulo}%`]
);

const getByColumn = (column, type) => pool.query(
    `SELECT 
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
        JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id', c.id,
            'categoria', c.categoria
        )) AS categorias
    FROM libros l
    LEFT JOIN libros_autores la ON l.id = la.libro_id
    LEFT JOIN autores a ON la.autor_id = a.id
    LEFT JOIN libros_categorias lc ON l.id = lc.libro_id
    LEFT JOIN categorias c ON lc.categoria_id = c.id
    GROUP BY 
        l.id, 
        l.titulo, 
        l.descripcion, 
        l.precio, 
        l.cantidad, 
        l.paginas, 
        l.imagen
    ORDER BY ${column} ${type};`
)

// POST libro
const create = async (body, imageName) => {
    try {
        const result = await pool.query(
            `INSERT INTO libros (titulo, descripcion, precio, cantidad, paginas, imagen) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [body.titulo, body.descripcion, body.precio, body.cantidad, body.paginas, `${process.env.COMPLETE_URL}/imagenes/libros/${imageName}`]
        );
        return result
    } catch (error) {
        console.error("Error al insertar libro:", error);
        throw error;
    }
};

// PUT libro
const update = async (id, body) => {
    try {
        const result = await pool.query(
            `UPDATE libros SET titulo = $1, descripcion = $2, precio = $3, cantidad = $4, paginas = $5 WHERE id = $6 RETURNING *`,
            [body.titulo, body.descripcion, body.precio, body.cantidad, body.paginas, id]
        );

        return result
    } catch (error) {
        console.error("Error al actualizar libro: ", error);
        throw error;
    }
};

// PUT cantidad stock libros
const updateCantidad = async (libroId, cantidad) => {
    try {
        const result = await pool.query(
            `UPDATE libros SET cantidad = $2 WHERE id = $1 RETURNING *`,
            [ libroId, cantidad ]
        )
        return result
    } catch(error) {
        console.error("Error al actualizar la cantidad del libro: ", error)
        throw error;
    }
} 

// PUT imagen de un libro
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
                console.error("Error al eliminar imagen")
            }
        }

        // Subida de la nueva Imagen
        const result = await pool.query(
            `UPDATE libros SET imagen = $1 WHERE id = $2 RETURNING *`,
            [`${process.env.COMPLETE_URL}/imagenes/libros/${imageName}`, id]
        );

        return result
    } catch (error) {
        console.error("Error al actualizar libro:", error);
        throw error;
    }
}

// DELETE libro
const remove = async (id) => {
    try {
        const result = await pool.query(`DELETE FROM libros WHERE id = $1`, [id]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// POST autor de libro
const assignAuthor = async (libroId, autorId) => {
    try {
        const result = await pool.query(
            `INSERT INTO libros_autores (libro_id, autor_id) VALUES ($1, $2) RETURNING *`,
            [libroId, autorId]
        );
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// PUT autor de libro
const updateAuthor = async (libroId, autorOldId, autorNewId) => {
    try {
        const result = await pool.query(
            `UPDATE libros_autores SET autor_id = $1 WHERE libro_id = $2 AND autor_id = $3 RETURNING *`,
            [ autorNewId, libroId, autorOldId ]
        );
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// DELETE autor de libro
const removeAuthors = async (libroId) => {
    try {
        const result = pool.query(
            `DELETE FROM libros_autores WHERE libro_id = $1 RETURNING *`,
            [ libroId ]
        );
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

// POST autor de libro
const assignCategory = async (libroId, categoriaId) => {
    try {
        const result = await pool.query(
            `INSERT INTO libros_categorias (libro_id, categoria_id) VALUES ($1, $2) RETURNING *`,
            [libroId, categoriaId]
        );
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// PUT autor de libro
const updateCategory = async (libroId, categoriaOldId, catrgoriaNewId) => {
    try {
        const result = await pool.query(
            `UPDATE libros_categorias SET categoria_id = $1 WHERE libro_id = $2 AND categoria_id = $3 RETURNING *`,
            [ catrgoriaNewId, libroId, categoriaOldId ]
        );
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// DELETE autor de libro
const removeCategories= async (libroId) => {
    try {
        const result = pool.query(
            `DELETE FROM libros_categorias WHERE libro_id = $1 RETURNING *`,
            [ libroId ]
        );
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}


module.exports = {
    get,
    getById,
    getByName,
    getByColumn,
    create,
    update,
    updateCantidad,
    updateImage,
    remove,
    assignAuthor,
    updateAuthor,
    removeAuthors,
    assignCategory,
    updateCategory,
    removeCategories
};