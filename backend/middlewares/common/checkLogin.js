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

        // Password-reset tokens are not login tokens.
        if (decoded.purpose) {
            return res.status(401).json({
                message: "Invalid access token",
            });
        }

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
    return async (req, res, next) => {
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

        // The role inside a JWT can be stale (demoted / suspended after the
        // token was issued), so privileged roles are re-checked in the DB.
        if (roles.includes("admin")) {
            try {
                const User = require("../../models/User");
                const fresh = await User.findById(req.user.id).select("role status");
                if (!fresh || fresh.role !== "admin" || fresh.status === "suspended") {
                    return res.status(403).json({
                        message: "Forbidden - Access denied",
                    });
                }
            } catch (error) {
                console.error("requireRole DB check failed:", error);
                return res.status(500).json({ message: "Authorization failed" });
            }
        }

        next();
    };
}

// Admin accounts only manage the store; they don't shop on the user side.
function forbidAdmin(req, res, next) {
    if (req.user?.role === "admin") {
        return res.status(403).json({
            message: "অ্যাডমিন অ্যাকাউন্ট দিয়ে এই কাজ করা যায় না",
        });
    }
    next();
}

module.exports = {
    checkLogin,
    requireRole,
    forbidAdmin,
};