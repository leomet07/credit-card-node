const router = require("express").Router();
const User = require("../model/User")
router.get("/", function (req, res) {
    res.send({
        message: "Hello from user action"
    });
});

router.post("/createCard", async function (req, res) {

    const query = req.body["query"];
    const new_data = req.body["data"]



    const data = (await User.findOne(query)).toObject();
    console.log(data)
    if (data.cards) {
        data.cards.push(new_data)
    } else {
        data.cards = [new_data]
    }


    User.findOneAndUpdate(query, {
        cards: data.cards
    }, {
        upsert: false
    }, function (err, doc) {
        if (err) {
            return res.send(200, {
                appended: false,
                error: err
            });
        }

        return res.send({
            created: true
        });
    })



});

module.exports = {
    router: router,
};