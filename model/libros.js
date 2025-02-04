/**
 *
 * ./model/libros.js
 * @fileoverview Modelo de las rutas de libros (MVC Model View Controller)
 * 
 */

const pool = require('./database.js');

const get = () => pool.query(`
    SELECT 
        l.id AS libro_id,
        l.titulo AS libro_titulo,
        l.descripcion AS libro_descripcion,
        l.precio AS libro_precio,
        l.cantidad AS libro_cantidad,
        l.paginas AS libro_paginas,
        l.imagen AS libro_imagen,
        a.id AS autor_id,
        a.nombre AS autor_nombre,
        a.apellidos AS autor_apellidos,
        a.imagen AS autor_imagen,
        a.descripcion AS autor_descripcion,
        STRING_AGG(DISTINCT c.categoria, ', ') AS categorias
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
        l.imagen,
        a.id, 
        a.nombre, 
        a.apellidos, 
        a.imagen, 
        a.descripcion
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
        a.id AS autor_id,
        a.nombre AS autor_nombre,
        a.apellidos AS autor_apellidos,
        a.imagen AS autor_imagen,
        a.descripcion AS autor_descripcion,
        STRING_AGG(DISTINCT c.categoria, ', ') AS categorias
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
        l.imagen,
        a.id, 
        a.nombre, 
        a.apellidos, 
        a.imagen, 
        a.descripcion
    ORDER BY l.id
`, [id]);

module.exports = {
    get,
    getById
};