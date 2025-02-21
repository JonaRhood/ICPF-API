/**
 *
 * ./model/userRegistration.js
 * @fileoverview Modelo de las rutas para el registro de usuarios (MVC Model View Controller)
 * 
*/

/**
 * IMPORTS
 */
const pool = require('./database.js');

/**
 * MODELOS
 */

// Creación de nueva categoría
const createPedido = async () => {
    try {
        const result = await pool.query(
            'INSERT INTO pedidos DEFAULT VALUES RETURNING *;'
        );
        return result;
    } catch (err) {
        throw err;
    }
};

const bookToPedido = async (pedidoId, bookId) => {
    try {
        const result = await pool.query(
            `INSERT INTO pedidos_libros (pedido_id, libro_id) VALUES ($1, $2) RETURNING *;`,
            [pedidoId, bookId]
        );
        return result;
    } catch (err) {
        throw err;
    }
}

const incomeByYear = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                EXTRACT(YEAR FROM p.fecha) AS año, 
                SUM(l.precio * pl.cantidad) AS total_ganado
            FROM pedidos_libros pl
            JOIN pedidos p ON pl.pedido_id = p.id
            JOIN libros l ON pl.libro_id = l.id
            GROUP BY año
            ORDER BY año DESC;`
        )
        return result;
    } catch (err) {
        throw err;
    }
}

const incomeByMonth = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                EXTRACT(YEAR FROM p.fecha) AS año,
                EXTRACT(MONTH FROM p.fecha) AS mes,
                SUM(l.precio * pl.cantidad) AS total_ganado
            FROM pedidos_libros pl
            JOIN pedidos p ON pl.pedido_id = p.id
            JOIN libros l ON pl.libro_id = l.id
            GROUP BY año, mes
            ORDER BY año DESC, mes DESC;`
        )
        return result;
    } catch(err) {
        throw err
    }
}

const yearBestSellers = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                EXTRACT(YEAR FROM p.fecha) AS año,
                l.titulo,
                SUM(pl.cantidad) AS total_vendido
            FROM pedidos_libros pl
            JOIN pedidos p ON pl.pedido_id = p.id
            JOIN libros l ON pl.libro_id = l.id
            GROUP BY año, l.id, l.titulo
            ORDER BY año DESC, total_vendido DESC;`
        )
        return result;
    } catch(err) {
        throw err
    }
}

const monthBestSellers = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                EXTRACT(YEAR FROM p.fecha) AS año,
                EXTRACT(MONTH FROM p.fecha) AS mes,
                l.titulo,
                SUM(pl.cantidad) AS total_vendido
            FROM pedidos_libros pl
            JOIN pedidos p ON pl.pedido_id = p.id
            JOIN libros l ON pl.libro_id = l.id
            GROUP BY año, mes, l.id, l.titulo
            ORDER BY año DESC, mes DESC, total_vendido DESC;`
        )
        return result;
    } catch(err) {
        throw err
    }
}

const rentableBooks = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                l.titulo,
                SUM(l.precio * pl.cantidad) AS ingresos_totales
            FROM pedidos_libros pl
            JOIN libros l ON pl.libro_id = l.id
            GROUP BY l.id, l.titulo
            ORDER BY ingresos_totales DESC`
        )
        return result;
    } catch(err) {
        throw err
    }
}



module.exports = {
    createPedido,
    bookToPedido,
    incomeByYear,
    incomeByMonth,
    yearBestSellers,
    monthBestSellers,
    rentableBooks
};