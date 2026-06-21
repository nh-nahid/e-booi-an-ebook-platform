const jwt = require('jsonwebtoken');

function checkLogin (req, res, next) {
    const token = req.signedCookies[process.env.COOKIE_NAME];

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        res.locals.loggedInUser = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}


module.exports = {
    checkLogin,
}