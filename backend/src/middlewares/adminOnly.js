// checks if the logged-in user is an admin
// must be used AFTER authMiddleware (req.user needs to exist)

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }
    next();
};

module.exports = adminOnly;
