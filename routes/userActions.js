const router = require("express").Router();

router.get("/", function (req, res) {
    res.send({ message: "Hello from user action" });
});

module.exports = {
    router: router,
};
