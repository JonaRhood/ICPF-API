/**
 * IMPORTS
 */
const pool = require('../model/database');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

/**
 * SESIÓN Y AUTENTIFICACIÓN
 */
// Sessión con express-session
const sessionMiddleware = session({
    genid: function (req) {
        return uuidv4();
    },
    store: new PgSession({ pool }),
    secret: process.env.EXPRESS_SESSION_SECRET,
    cookie: { maxAge: 300000000, secure: false, httpOnly: true },
    saveUninitialized: false,
    resave: false,
    rolling: true,
});

// Serialización
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialización
passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return done(null, false);
        }

        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
});

// Estrategia local de login
const salt = 4;

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

                if (result.rows.length === 0) {
                    return done(null, false, { message: "Correo no registrado" });
                }

                const user = result.rows[0];
                // Comparar contraseñas con bcrypt
                const isMatch = await bcrypt.compare(password, user.contraseña);

                if (!isMatch) {
                    return done(null, false, { message: "Contraseña incorrecta" });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

module.exports = { passport, sessionMiddleware };