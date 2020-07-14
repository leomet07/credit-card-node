const router = require("express").Router();
const verifyToken = require("./verifyToken");
const Global_Card = require("../model/Global_Card");
const { cardValidation } = require("../validation");

// Cards data is only for authenitcated users
router.use(verifyToken);
// Get all the cards, or search by params in request body.
router.get("/", async (req, res) => {
    try {
        const cards = await Global_Card.find(req.body || {});
        res.json(cards);
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Create a new card if it doesnt exist in the global card lookup table.
router.post("/create", async (req, res) => {
    const validation = cardValidation(req.body);
    if ("error" in validation) {
        return res.status(200).end(
            JSON.stringify({
                message: validation.error.details[0].message,
                created: false,
            })
        );
    }
    req.body.name = String(req.body.name).toLowerCase();
    // Check if email exists in db
    const cardExist = await Global_Card.findOne({
        name: req.body.name,
    });

    if (cardExist) {
        return res.status(200).end(
            JSON.stringify({
                message: "Card Name already exists",
                created: false,
            })
        );
    }

    const card = new Global_Card({
        name: req.body.name,
    });

    let savedCard;
    try {
        savedCard = await card.save();
        res.json({ card: savedCard, created: true });
    } catch (err) {
        //res.sendStatus(400).send({logged_inerr);
    }
});

module.exports.router = router;
