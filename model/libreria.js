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

// Análisis de las ventas por Año
const incomeByYear = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                EXTRACT(YEAR FROM p.fecha) AS año, 
                SUM(l.precio * pl.cantidad) AS total_ganado
            FROM pedidos_libros pl
            JOIN pedidos p ON pl.pedido_id = p.id
            JOIN libros l ON pl.libro_id = l.id
            WHERE EXTRACT(YEAR FROM p.fecha) = EXTRACT(YEAR FROM CURRENT_DATE) -- Filtrar solo el año actual
            GROUP BY año
            ORDER BY año DESC;`
        )
        return result;
    } catch (err) {
        throw err;
    }
}

// Análisis de las ventas por Mes
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
            WHERE EXTRACT(YEAR FROM p.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY año, mes
            ORDER BY mes ASC;`
        )
        return result;
    } catch (err) {
        throw err
    }
}

// Análisis de los Best Sellers por Año
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
            WHERE EXTRACT(YEAR FROM p.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY año, l.id, l.titulo
            ORDER BY total_vendido DESC
            LIMIT 20;`
        )
        return result;
    } catch (err) {
        throw err
    }
}

// Análisis de los Best Sellers por Mes
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
    } catch (err) {
        throw err
    }
}

// Análisis de los libros más rentables
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
    } catch (err) {
        throw err
    }
}

// Crear un nuevo Pedido
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

// Assignar Libro y Cantidad al Pedido
const bookToPedido = async (pedidoId, bookId, cantidad) => {
    try {
        const result = await pool.query(
            `INSERT INTO pedidos_libros (pedido_id, libro_id, cantidad) VALUES ($1, $2, $3) RETURNING *;`,
            [pedidoId, bookId, cantidad]
        );
        return result;
    } catch (err) {
        throw err;
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