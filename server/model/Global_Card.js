const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 4,
		max: 50,
	},
	card_network: {
		type: String,
		required: true,
		min: 3,
		max: 15,
	},
});

const cardModel = mongoose.model("Card", cardSchema);

module.exports = cardModel;