const mongoose = require("mongoose");

const UsercardSchema = new mongoose.Schema({


	global_card_id: {
		type: String,
		required: true,
		min: 4,
		max: 255,
	},

});

const UsercardModel = mongoose.model("UserCard", UsercardSchema);

module.exports = UsercardModel;