<template>
	<div class="home">
		<h1>Credit Card Search</h1>
		<div v-if="$global.logged_in">
			<h2>You are logged in!</h2>

			<div id="global_cards" ref="global_cards">
				<h2>Card types</h2>
				<div id="global_cards_display" v-if="global_cards.length > 0">
					<GlobalCard
						:ref="'global_card' + cyclecard._id"
						class="global_card"
						:card_id="cyclecard._id"
						:name="cyclecard.name"
						v-for="cyclecard in global_cards"
						:key="'global_card' + cyclecard._id"
					/>

					<hr id = "splitter"> </hr>
				</div>
				<h3 v-else>No global Credit cards in the system.</h3>
				<form
					ref="create_global_card_form "
					v-on:submit="create_global_card"
					id="add_global_card"
					autocomplete="off"
					action="#"
				>
					<TextInput
						id="global_card_name"
						ref="global_card_name"
						type="text"
						name="global_card_name"
						placeholder="Card Name"
						autocomplete="off"
						class="input"
						required
					/>
					<br />

					<input type="submit" class="button" value="Submit" />
				</form>
			</div>
			<br />
			<div id="user_cards">
				<h2>User cards</h2>
				<div id="user_cards_display" v-if="user_cards.length > 0">
					<UserCard
						:ref="'usercard' + usercard.global_card_id"
						class="user_card"
						:card_id="usercard.global_card_id"
						:id="'usercard' + usercard.global_card_id"
						:name="usercard.name"
						v-for="usercard in user_cards"
						:key="usercard._id"
					/>
				</div>
				<h4 v-else>No Cards on your account yet!</h4>
			</div>

			<br />
		</div>
		<!-- 
		<img
			id="tracker_img"
			:src="
				'https://request-tracker.herokuapp.com/count/app1?date=' +
					Date.now()
			"
		/>

		-->
	</div>
</template>

<script>
// @ is an alias to /src
import GlobalCard from "@/components/GlobalCardComponent.vue";
import UserCard from "@/components/UserCardComponent.vue";
import TextInput from "@/components/TextInput.vue";

export default {
	name: "Home",
	components: { GlobalCard, UserCard, TextInput },
	methods: {
		handleIntersect: async function (entries) {
			if (entries[0].isIntersecting) {
				console.warn("something is intersecting with the viewport");
				console.log(this.global_cards.length);
				const { global_cards, count, skipped } = await get_global_cards(
					this.$global.auth_token,
					this.global_cards.length
				);
				console.log({ global_cards, count, skipped });

				this.global_cards = [...this.global_cards, ...global_cards];
			}
		},
		create_global_card: async function (e) {
			e.preventDefault();

			console.log("Submitted");
			if (this.$global.checked_token) {
				const name = this.$refs.global_card_name.$refs.text.value;
				const body = { name: name, card_network: "visa" };

				const raw = JSON.stringify(body);
				console.log(this.$global);

				const requestOptions = {
					method: "POST",
					headers: {
						"content-type": "application/json",
						"auth-token": this.$global.auth_token,
					},
					body: raw,
				};
				let response = null;
				await fetch(
					window.BASE_URL + "/api/cards/create",
					requestOptions
				)
					.then((text) => text.text())
					.then((r) => {
						response = JSON.parse(r);
						console.log("Result: ", response);
					});

				if (response.created === false) {
					// Not created due to bad card details in request
					alert(response.message);
				} else {
					this.global_cards.push(response.card);
				}
			}
		},
	},
	data() {
		return {
			global_cards: [],
			user_cards: [],
			global_cards_skip: 0,
		};
	},
	async created() {
		console.log("Created");
		this.$root.$once("checked_token", async () => {
			// Add form event listener when token listener is avaialable
			//perform some logic
			// get token cuz it takes a second to load.
			const auth_token = this.$global.auth_token;
			if (auth_token && auth_token != "" && auth_token !== null) {
				const { global_cards, count, skipped } = await get_global_cards(
					auth_token,
					this.global_cards_skip
				);
				console.log({ global_cards, count, skipped });

				this.global_cards = global_cards;

				console.log("uid ", this.$global.uid);
				const user_cards = await get_user_cards(
					auth_token,
					this.$global.uid
				);
				if (user_cards.error) {
					const message = user_cards.message;
					alert(message);
				} else {
					this.user_cards = user_cards;
					console.log({ user_cards });
				}
			}
			console.log("Done getting cards");
			let options = {
				root: null,
				rootMargins: "0px",
				threshold: 0.5,
			};
			const observer = new IntersectionObserver(
				this.handleIntersect,
				options
			);
			observer.observe(document.getElementById("splitter"));
		});

		this.$root.$on("deleted_global_card", async (id) => {
			console.log("Received a deltion of card:", id);
			let i = this.global_cards.map((card) => card._id).indexOf(id); // find index of your object
			this.global_cards.splice(i, 1); // remove it from array

			let u = this.user_cards
				.map((card) => card.global_card_id)
				.indexOf(id); // find index of user card
			this.user_cards.splice(u, 1); // remove it from array
		});

		this.$root.$on("edited_global_card", async (data) => {
			console.log("EDITED GLOBAL CARD RECIEVED: ", data);

			// Change the cards data in global store with the data passed up
			let u = this.global_cards.map((card) => card._id).indexOf(data._id); // find index of user card
			this.global_cards.splice(u, 1, data);

			let keys = Object.keys(data);
			console.log("editing loop keys", keys);
			keys.splice(keys.indexOf("_id"), 1);
			keys.splice(keys.indexOf("__v"), 1);

			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];

				this.$refs["usercard" + data._id][0][key + "_data"] = data[key];
			}
		});

		this.$root.$on("CardAddUnderUser", (data) => {
			console.log("CardAddUnderUser recieved");

			this.user_cards = data.cards;
		});
		this.$root.$on("deleted_user_card", (id) => {
			console.log("deleted_user_card recieved");
			console.log(this.user_cards);
			let i = this.user_cards.map((card) => card.card_id).indexOf(id); // find index of your object
			this.user_cards.splice(i, 1); // remove it from array
		});
	},
};

async function get_global_cards(auth_token, skip) {
	//var myHeaders = new Headers();
	let myHeaders = {};
	myHeaders["Content-Type"] = "application/json";
	myHeaders["auth-token"] = auth_token;

	console.log("Going to skip: ", skip);
	const body = JSON.stringify({ skip: skip });

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		redirect: "follow",
		body: body,
	};

	let cards = [];
	await fetch(window.BASE_URL + "/api/cards/", requestOptions)
		.then((response) => response.text())
		.then((result) => {
			cards = result;
		})
		.catch((error) => console.log("error", error));

	cards = JSON.parse(cards);
	return cards;
}

async function get_user_cards(auth_token, uid) {
	//var myHeaders = new Headers();
	let myHeaders = {};
	//myHeaders.append("Content-Type", "application/json");
	myHeaders["auth-token"] = auth_token;
	myHeaders["content-type"] = "application/json";

	const body = JSON.stringify({ _id: uid });
	let requestOptions = {
		method: "POST",
		headers: myHeaders,
		redirect: "follow",
		body: body,
	};
	console.log({ requestOptions });
	let cards = [];

	console.log(window.BASE_URL + "/api/user/action/getCards/");
	await fetch(window.BASE_URL + "/api/user/action/getCards/", requestOptions)
		.then((response) => {
			return response.text();
		})
		.then((result) => {
			cards = result;
		})
		.catch((error) => console.log("Error", error));
	const result = JSON.parse(cards);

	return result;
}
</script>
<style scoped>
#global_cards {
	width: 95%;
	/* border: 1px solid red; */
	border: 1px solid black;
	display: inline-block;
	padding-left: auto;
	padding-bottom: 10px;
	padding-right: auto;
	height: 485px;
}
/* for mobile */
@media only screen and (min-width: 800px) {
	#global_cards{
		width: 45%;
	}
}
#global_cards_display {
	overflow: scroll;
	height: 300px;
}
#user_cards {
	width: 400px;
	/* border: 1px solid red; */
	border: 1px solid black;
	display: inline-block;
	padding: auto;
	margin-top: 20px;
}
.global_card {
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 10px;
}
.user_card {
	margin-top: 10px;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 10px;
}
.input {
	display: inline-block;
	width: 80%;
	max-width: 400px;
	margin-bottom: 15px;
}
.button {
	margin-top: 15px;
	font-size: 17px;
	padding-top: 3px;
	padding-bottom: 3px;
	padding-right: 7px;
	padding-left: 7px;
	border: 1px solid black;
	-webkit-appearance: none;
	border-radius: 0;
}

#tracker_img {
	margin-top: 5px;
	width: 80px;
}
</style>
