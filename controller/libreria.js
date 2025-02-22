/**
 *
 * ./controller/autores.js
 * @fileoverview Controladores de las rutas de autores (MVC Model View Controller)
 * 
 */

"use strict";

const {
    createPedido, bookToPedido, incomeByYear,
    incomeByMonth, yearBestSellers, monthBestSellers,
    rentableBooks,
} = require('../model/libreria.js');

exports.readIncomeByYear = async (req, res) => {
    try {
        const task = await incomeByYear()
        return res.status(200).json(task.rows)
    } catch(err) {
        return res.status(404).json({ error: err });
    }
}

exports.readIncomeByMonth = async (req, res) => {
    try {
        const task = await incomeByMonth()
        return res.status(200).json(task.rows)
    } catch(err) {
        return res.status(404).json({ error: err })
    }
}

exports.readByYearBestSellers = async (req, res) => {
    try{
        const task = await yearBestSellers()
        return res.status(200).json(task.rows)
    } catch(err) {
        return res.status(404).json({ error: err })
    }
}

exports.readByMonthBestSellers = async (req, res) => {
    try{
        const task = await monthBestSellers()
        return res.status(200).json(task.rows)
    } catch(err) {
        return res.status(404).json({ error: err })
    }
}

exports.readByRentableBooks = async (req, res) => {
    try{
        const task = await rentableBooks()
        return res.status(200).json(task.rows)
    } catch(err) {
        return res.status(404).json({ error: err })
    }
}

exports.createPedidoLibreria = async (req, res) => {
    try {
        const task = await createPedido();
        return res.status(201).json(task.rows);
    } catch(err) {
        return res.status(400).json({ error: err.detail });
    }
};

exports.assingBookToPedido = async (req, res) => {
    const { pedidoId, libroId, cantidad } = req.query;
    try {
        const task = await bookToPedido(pedidoId, libroId, cantidad);
        return res.status(201).json(task.rows);
    } catch(err) {
        return res.status(400).json({ error: err });
    }
}
