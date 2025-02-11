require("dotenv").config();

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

module.exports = {
    isAuthenticated,
    librarySuperUserAuthenticated
};