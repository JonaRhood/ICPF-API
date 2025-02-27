require("dotenv").config();
const { body } = require('express-validator');

const isAuthenticated = (req, res, next) => {
    console.log('Is authenticated:', req.isAuthenticated()); 
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autorizado" });
    }
    next();
};

const librarySuperUserAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.email === process.env.SUPERUSER_LIBRARY) {
            return next();
        } else {
            return res.status(403).send("No tienes permisos para acceder a esta página.");
        }
    } else {
        return res.redirect("/login_libreria");
    }
}

// Función para validar los campos
const validateForm = () => [
    body('fieldname')
        .custom((value) => {
            if (typeof value === 'string') {
                return true;
            } else if (typeof value === 'number') {
                return true;
            } else {
                throw new Error('El nombre del campo debe ser una cadena o un número.');
            }
        }),
    body('value')
        .custom((value) => {
            if (typeof value === 'string') {
                return true;
            } else if (typeof value === 'number') {
                return true;
            } else {
                throw new Error('El valor debe ser una cadena o un número.');
            }
        }),
];

module.exports = {
    isAuthenticated,
    librarySuperUserAuthenticated,
    validateForm,
};