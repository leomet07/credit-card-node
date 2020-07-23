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
        res.json({
            message: err.message,
        });
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
        res.json({
            card: savedCard,
            created: true,
        });
    } catch (err) {
        //res.sendStatus(400).send({logged_inerr);
    }
});

router.put("/update", async function (req, res) {
    const card_id = req.body["_id"];
    if (!card_id) {
        return res.send({
            updated: false,
            message: "Card ID not specified",
        });
    }
    const change_to = req.body.update;
    if (!change_to) {
        return res.send({
            updated: false,
            message: "Updation value not specified",
        });
    }

    // Remove change_to _id property to not change id
    if (change_to && change_to["_id"]) {
        delete change_to._id;
    }

    Global_Card.findByIdAndUpdate(card_id, change_to, function (err, old) {
        let new_object = { ...old._doc, ...change_to };
        console.log("Changed to: ", new_object);
        return res.send({
            updated: true,
            changed_to: new_object,
        });
    });
});

router.delete("/delete", async function (req, res) {
    console.log("Deleting card");
    const query = req.body;
    if (query === {} || !query["_id"]) {
        return res.send({
            deleted: false,
            message: "No id specified in object.",
        });
    }

    // Check if card exists before deleting
    let check_card = await Global_Card.findById(query["_id"]);
    if (!check_card) {
        return res.send({
            deleted: false,
            message: "Card with that ID doesnt exist.",
        });
    }

    Global_Card.findByIdAndDelete(query["_id"], function (err) {
        if (err) {
            return res.send({
                deleted: false,
                message: err.message,
            });
        } else {
            return res.send({
                deleted: true,
            });
        }
    });
});

module.exports.router = router;