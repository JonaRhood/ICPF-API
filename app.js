/**
 *
 * app.js
 * @fileoverview Configuraciones principales del servidor
 *  
 */

"use strict";

/**
 * TASKS
 */
// TODO Añadir CORS
// TODO Sanitizar DB
// TODO Instalar libreria "helmet" (Solo funciona en oficial)
// TODO Instalar libreria express-validator o validatorjs para prevenir SQL injections
// TODO Instalar libreria "csurf" para prevenir CSRF en forms.
// TODO Organizar código para path: login, registro y logout
// TODO ESlint

/**
 * IMPORTS
 */
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('./model/database.js');
const librosRoutes = require('./routes/libros.js');
const usuariosRoutes = require('./routes/usuarios.js');
const autoresRoutes = require('./routes/autores.js');
const { passport, sessionMiddleware } = require('./session/session.js');
require('dotenv').config();
const { isAuthenticated } = require('./middleware/middleware.js');

/**
 * INICIALIZACION DEL SERVIDOR
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * MIDDLEWARE
 */
// Habilitar el servicio de archivos estáticos desde la carpeta /public
app.use(express.static(path.join(__dirname, 'public')));

// Habilitar el soporte JSON en las solicitudes
app.use(express.json());

// Deshabilitar el soporte para formularios
app.use(express.urlencoded({ extended: false }));

// Inicialización de passport y express-session (Autenticación)
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

/**
 * PATHS
 */

// Login y Logout
app.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    res.json({ message: "Autenticación exitosa" });
});

app.post("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.json({ message: "Sesión cerrada correctamente" });
    });
});

// Registro de Usuarios
app.post('/registro', async (req, res) => {
    const salt = 4;
    try {
        // Encriptación de la contraseña
        const saltRounds = await bcrypt.genSalt(salt);
        const pass = await bcrypt.hash(req.body.contraseña, saltRounds);
        req.body.contraseña = pass;
        // Creación de nuevo usuario
        const task = await pool.query(
            'INSERT INTO usuarios (nombre, apellidos, email, contraseña, nacimiento) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [req.body.nombre, req.body.apellidos, req.body.email, req.body.contraseña, req.body.nacimiento]
        );
        return res.status(201).send(`Usuario con nuevo id ${task.rows[0].id} creado`);
    } catch (err) {
        return res.status(400).json({ error: err.detail });
    }
});

// Rutas de la API
app.use('/libros', librosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/autores', autoresRoutes);

// Comprobación de Salud del Servidor
app.get('/health', (req, res) => {
    res.sendStatus(200);
});

/**
 * LISTENER
 */
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});