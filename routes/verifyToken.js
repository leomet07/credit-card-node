const jwt = require("jsonwebtoken");
const check_verify = require("./auth").check_verify;
// Middleware for private routes
module.exports = function (req, res, next) {

    let token = req.header("auth-token") || null;

    if (!token) {
        res.send({
            denied: true,
            message: "Acess Denied!"
        });
    }

    try {
        const verified = check_verify(token);
        req.user = verified;

        next();
    } catch (err) {

        res.send({
            denied: true,
            message: "Invalid token -> Acess denied"
        });
    }
};