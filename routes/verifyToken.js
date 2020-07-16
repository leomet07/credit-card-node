const jwt = require("jsonwebtoken");
const check_verify = require("./auth").check_verify;
// Middleware for private routes
module.exports = function (req, res, next) {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(200).end({
            denied: true,
            message: "Acess Denied!"
        });
    }

    try {
        const verified = check_verify(token);
        req.user = verified;

        next();
    } catch (err) {

        res.status(200).end({
            denied: true,
            message: "Invalid token -> Acess denied"
        });
    }
};