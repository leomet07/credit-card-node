const router = require("express").Router();
const User = require("../model/User");
const User_Card = require("../model/User_Card");
const Global_Card = require("../model/Global_Card");

async function get_cards(user) {
	const cards = user.cards;

	for (let i = 0; i < cards.length; i++) {
		let card = cards[i];
		const global_id = card.global_card_id;
		let global_card = await Global_Card.findById(global_id);

		if (!global_card) {
			return {
				error: true,
				message: "Global card with that ID doesnt exist",
			};
		}
		global_card = global_card.toObject();
		delete global_card["_id"];

		delete global_card["__v"];

		card = {
			...global_card,
			...card,
		};

		cards[i] = card;
	}
	// console.log('before return', cards)
	return cards;
}

router.get("/", function (req, res) {
	res.send({
		message: "Hello from user action",
	});
});
router.post("/getCards", async function (req, res) {
	const _id = req.body._id;
	// console.log("_id", _id);
	let user = await User.findById(_id);

	user = user.toObject();

	let cards = await get_cards(user);
	// console.log('after return: ', cards)

	res.send(cards);
});
router.post("/createCard", async function (req, res) {
	// Check if card under user already exists
	const user_query = req.body["query"];
	const new_data = req.body["data"];

	// Check if card type exists
	try {
		const card_exist = await Global_Card.find({
			_id: new_data.global_card_id,
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
			error: err,
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
			error_message: `Card with card type id: "${new_data["global_card_id"]}" already exists under User.`,
		});
	}

	let data_schemized;
	try {
		data_schemized = new User_Card(new_data);
	} catch (err) {
		return res.send({
			appended: false,
			error_message: err.message,
			error: err,
		});
	}

	const schema_obj = data_schemized.toObject();

	if (data.cards) {
		data.cards.push(schema_obj);
	} else {
		data.cards = [schema_obj];
	}

	try {
		// find and update
		let user = await User.findOneAndUpdate(
			user_query, {
				cards: data.cards,
			}, {
				upsert: false,
			}
		);
		// find with changes
		user = await User.findOne(user_query);

		user = user.toObject();
		// console.log("user: ", user)
		// Get all cards from db
		const db_cards = await get_cards(user);
		// console.log("db_cards: ", db_cards)
		return res.send({
			created: true,
			cards: db_cards,
		});
	} catch (err) {
		return res.send(200, {
			appended: false,
			error: err,
		});
	}
});

router.delete("/deleteCard", async function (req, res) {
	/*
	let user = await User.findOne(req.body.userid);

	user = user.toObject();

	const cards = user.cards.filter((card) => card.global_card_id !== req.body.global_card_id);

	console.log('New cards: ', cards)
	*/

	User.findByIdAndUpdate(
		req.body.userid, {
			$pull: {
				cards: {
					global_card_id: req.body.global_card_id,
				},
			},
		},
		function (err) {
			if (err) {
				return res.send({
					deleted: false,
					message: err.message,
				});
			}
			return res.send({
				deleted: true,
			});
		}
	);
});

module.exports = {
	router: router,
};