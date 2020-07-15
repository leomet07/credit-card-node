const router = require("express").Router();
const User = require("../model/User");
const User_Card = require("../model/User_Card")


router.get("/", function (req, res) {
    res.send({
        message: "Hello from user action"
    });
});

router.post("/createCard", async function (req, res) {

    const query = req.body["query"];
    const new_data = req.body["data"]

    let data_schemized;
    try {
        data_schemized = new User_Card(new_data);
    } catch (err) {
        return res.send({
            appended: false,
            error_message: err.message,
            error: err
        });
    }


    const schema_str = data_schemized.toObject();

    let data;
    try {
        data = (await User.findOne(query)).toObject();

    } catch (err) {
        return res.send({
            appended: false,
            error_message: err.message,
            error: err
        });
    }


    if (data.cards) {
        data.cards.push(schema_str)
    } else {
        data.cards = [schema_str]
    }

    try {
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
    } catch (err) {
        return res.send(200, {
            appended: false,
            error: err
        });
    }




});

module.exports = {
    router: router,
};