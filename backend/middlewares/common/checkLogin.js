const jwt = require("jsonwebtoken");

// =======================
// AUTHENTICATION MIDDLEWARE
// =======================
function checkLogin(req, res, next) {
    const token =
        req.signedCookies?.[process.env.COOKIE_NAME] ||
        req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized - No token found",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        res.locals.loggedInUser = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}

// =======================
// ROLE BASED ACCESS CONTROL
// =======================
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden - Access denied",
            });
        }

        next();
    };
}

module.exports = {
    checkLogin,
    requireRole,
};