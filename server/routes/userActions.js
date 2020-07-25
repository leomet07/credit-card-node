const router = require("express").Router();
const User = require("../model/User");
const User_Card = require("../model/User_Card")
const Global_Card = require("../model/Global_Card")


router.get("/", function (req, res) {
	res.send({
		message: "Hello from user action"
	});
});
router.post("/getCards", async function (req, res) {
	const _id = req.body._id;

	let user = (await User.findById(_id))

	user = user.toObject();

	const cards = user.cards;


	for (let i = 0; i < cards.length; i++) {
		let card = cards[i]
		const global_id = card.global_card_id;
		const global_card = (await Global_Card.findById(global_id)).toObject();
		delete global_card["_id"]
		delete card["_id"]
		delete global_card["__v"]

		card = {

			...global_card,
			...card
		}

		cards[i] = card

	}
	res.send(cards)

})
router.post("/createCard", async function (req, res) {


	// Check if card under user already exists
	const user_query = req.body["query"];
	const new_data = req.body["data"]

	// Check if card type exists
	try {

		const card_exist = await Global_Card.find({
			_id: new_data.global_card_id
		});
	} catch (err) {

		return res.send({
			appended: false,
			error_message: "Card doesn't exists in global card lookup table.",

		});


	}


	let data;
	try {
		data = (await User.findOne(user_query)).toObject();

	} catch (err) {
		return res.send({
			appended: false,
			error_message: err.message,
			error: err
		});
	}



	let found = false;
	for (let i = 0; i < data.cards.length; i++) {
		//console.log(data.cards[i]["global_card_id"], new_data["global_card_id"], data.cards[i]["global_card_id"] == new_data["global_card_id"])
		if (data.cards[i]["global_card_id"] == new_data["global_card_id"]) {
			found = true;
			break;
		}
	}

	if (found) {
		return res.send({
			appended: false,
			error_message: `Card with card type id: "${new_data['global_card_id']}" already exists under User.`
		});
	}



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




	if (data.cards) {
		data.cards.push(schema_str)
	} else {
		data.cards = [schema_str]
	}

	try {
		User.findOneAndUpdate(user_query, {
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