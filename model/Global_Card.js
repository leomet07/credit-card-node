const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255,
    },
});

const cardModel = mongoose.model("Card", cardSchema);

module.exports = cardModel;
