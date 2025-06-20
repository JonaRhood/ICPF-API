/**
 *
 * app.js
 * @fileoverview Configuraciones principales del servidor
 *  
 */

"use strict";

/**
 * IMPORTS
 */
// Imports de Tecnologías
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('./db/database.js');
const { passport, sessionMiddleware } = require('./middleware/session/session.js');
const helmet = require("helmet");
const cors = require("cors");
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require("cookie-parser");
// const morgan = require("morgan")
require('dotenv').config();
const { librarySuperUserAuthenticated } = require('./middleware/middleware.js');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');


// Imports de Rutas
const librosRoutes = require('./routes/libros.js');
const usuariosRoutes = require('./routes/usuarios.js');
const autoresRoutes = require('./routes/autores.js');
const categoriasRoutes = require('./routes/categorias.js');
const libreriaRoutes = require('./routes/libreria.js');

// Captura de errores globales
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err);
});

/**
 * INICIALIZACION DEL SERVIDOR
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * MIDDLEWARE
 */
// Morgan para asistencia en Logs
// app.use(morgan('dev'));

// Middleware para la correcta manipulacion de Cookies (CSRF)
app.use(cookieParser());

// Habilitar el servicio de archivos estáticos desde la carpeta /public y /assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

// Habilitar el soporte JSON en las solicitudes
app.use(express.json());

// Deshabilitar el soporte para formularios
app.use(express.urlencoded({ extended: true }));

// Inicialización de passport y express-session (Autenticación)
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Middleware CORS para protección Cross-Origin Resource Sharing
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://192.168.1.36:5173',
        'https://aws-0-eu-west-3.pooler.supabase.com:6543',
        'https://icpf-api-production.up.railway.app',
        'https://iguiskudllwluojaxepj.supabase.co',
        'https://icpf-api-bjeh.onrender.com',
        'https://caminandoporfe.netlify.app',
        'https://caminandoporfe.es',
    ],
    credentials: true,
}));

// Middleware Helmet para la seguridad HTTPS y CSP
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://aws-0-eu-west-3.pooler.supabase.com:6543", "https://icpf-api-production.up.railway.app", 'https://icpf-api-bjeh.onrender.com'],
            imgSrc: ["'self'", "data:", "https://iguiskudllwluojaxepj.supabase.co"],
        },
    })
);

// Middleware Para la seguridad CSRF
// Opciones para doubleCsrf
const doubleCsrfOptions = {
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: "csrfToken",
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromRequest: (req) => {
        return req.body._csrf || req.headers["x-csrf-token"] || req.cookies.csrfToken;
    },
};

const {
    generateToken,
    doubleCsrfProtection,
} = doubleCsrf(doubleCsrfOptions);

/**
 * PATHS
 */

app.get('/', (req, res) => res.send('Servidor funcionando'));

// Login y Logout, envio de solicitud en body de "username" y "password"
app.post("/login", doubleCsrfProtection, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        // Path del cliente
        const referer = req.headers.referer || "";
        if (err) {
            console.log("Error en autenticación:", err);
            return next(err);
        }
        if (!user) {
            console.log("Usuario no autenticado:", info);
            return res.status(401).json({ message: "Fallo en autenticación", info });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log("Error en logIn:", err);
                return next(err);
            }

            if (process.env.NODE_ENV !== 'production') {
                console.log("Usuario autenticado correctamente:", user.email);
            }

            // Redireccionamiento al autenticar
            if (referer.includes("/login_libreria") && user.email === process.env.SUPERUSER_LIBRARY) {
                return res.json({ redirect: "/inicio_libreria" });
            } else {
                return res.json({ message: "Autenticación exitosa" });
            }
        });
    })(req, res, next);
});

app.post("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.json({ message: "Sesión cerrada correctamente" })
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
            [req.body.nombre, req.body.apellidos, req.body.email.toLowerCase(), req.body.contraseña, req.body.nacimiento]
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
app.use('/categorias', categoriasRoutes);
app.use('/libreria', libreriaRoutes);

// Generador de Token CSRF
app.get('/csrf', (req, res) => {
    const token = generateToken(req, res);
    res.status(200).json({ csrfToken: token })
});

// Rutas del cliente del servidor para la Libreria
app.get('/login_libreria', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'login.html'));
});

app.get('/inicio_libreria', librarySuperUserAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Documentación SWagger UI
const swaggerDocument = YAML.load(path.join(__dirname, 'src', 'swagger', 'swagger-config.yaml'));
const options = {
    customCss: '.topbar { display: none }',
    customSiteTitle: "Documentación de la API",
    customfavIcon: ""
};
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// Comprobación de Salud del Servidor
app.get('/health', (req, res) => {
    res.sendStatus(200);
});

/**
 * LISTENER
 */
app.listen(port, () => {
    console.log(`Servidor escuchando en ${process.env.URL}:${port}`);
});