/**
 *
 * ./model/autores.js
 * @fileoverview Modelo de las rutas de autores (MVC Model View Controller)
 * 
 */

const pool = require('./database.js');

const get = () => pool.query(`
    SELECT
        a.id AS autor_id,
        a.nombre AS autor_nombre,
        a.apellidos AS autor_apellidos,
        a.imagen AS autor_imagen,
        a.descripcion AS autor_descripcion,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', l.id,
                'titulo', l.titulo
            )
        ) AS libros
    FROM libros l
    JOIN libros_autores la ON l.id = la.libro_id
    JOIN autores a ON la.autor_id = a.id
    GROUP BY
        a.id,
        a.nombre,
        a.apellidos,
        a.imagen,
        a.descripcion
    ORDER BY a.id;
`);

const getById = (id) => pool.query(`
    SELECT
        a.id AS autor_id,
        a.nombre AS autor_nombre,
        a.apellidos AS autor_apellidos,
        a.imagen AS autor_imagen,
        a.descripcion AS autor_descripcion,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', l.id,
                'titulo', l.titulo,
              	'descripcion', l.descripcion,
              	'precio', l.precio,
              	'cantidad', l.cantidad,
              	'paginas', l.paginas,
              	'imagen', l.imagen
            )
        ) AS libros
    FROM libros l
    JOIN libros_autores la ON l.id = la.libro_id
    JOIN autores a ON la.autor_id = a.id
    WHERE a.id = $1
    GROUP BY
        a.id,
        a.nombre,
        a.apellidos,
        a.imagen,
        a.descripcion
    ORDER BY a.id;
`, [id]);

const create = async (body, imageName) => {
    console.log(body.nombre)
    try {
        const result = await pool.query(
            `INSERT INTO autores (nombre, apellidos, imagen, descripcion) VALUES ($1, $2, $3, $4) RETURNING *`,
            [body.nombre, body.apellidos, `http://localhost:8000/imagenes/autores/${imageName}`, body.descripcion]
        );
        return result
    } catch(err) {
        console.error("Error al insertar autor:", err);
        throw err;
    };
}

module.exports = {
    get,
    getById,
    create
};