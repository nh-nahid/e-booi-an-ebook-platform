const jwt = require("jsonwebtoken");

// =======================
// AUTHENTICATION MIDDLEWARE
// =======================
function checkLogin(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized - Access token missing",
            });
        }

        const accessToken = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET
        );

        req.user = decoded;
        res.locals.loggedInUser = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Access token expired",
                code: "TOKEN_EXPIRED",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid access token",
            });
        }

        return res.status(500).json({
            message: "Authentication failed",
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