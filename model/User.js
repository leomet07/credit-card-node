const mongoose = require("mongoose");

const usercard_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 255,
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    cards: []
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;