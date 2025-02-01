const isAuthenticated = (req, res, next) => {
    console.log('Is authenticated:', req.isAuthenticated()); 
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autorizado" });
    }
    next();
};

module.exports = {
    isAuthenticated
};