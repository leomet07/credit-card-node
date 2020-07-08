const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
    res.json([
        {
            cards: "My first card",
            description: "Random card data",
        },
    ]);
});

module.exports = router;
