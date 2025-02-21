/**
 *
 * ./routes/autores.js
 * @fileoverview Rutas API de la tabla autores 
 * 
 */

"use strict";

/**
 * IMPORTS
 */
const express = require('express');
const { 
    createPedidoLibreria, assingBookToPedido, readIncomeByYear,
    readIncomeByMonth, readByYearBestSellers, readByMonthBestSellers,
    readByRentableBooks
} = require('../controller/libreria.js');

const router = express.Router()

/**
 * PATHS
 */
router.get('/year', readIncomeByYear);
router.get('/month', readIncomeByMonth);
router.get('/year/best', readByYearBestSellers);
router.get('/month/best', readByMonthBestSellers);
router.get('/rentable', readByRentableBooks);
router.post('/pedido', createPedidoLibreria);
router.post('/assign', assingBookToPedido);

module.exports = router;