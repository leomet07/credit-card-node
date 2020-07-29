<template>
	<div id="card">
		<p>{{ name }}</p>
		<button class="button" v-on:click="delete_card">Delete me</button>
	</div>
</template>

<script>
// import TextInput from "@/components/TextInput.vue";
export default {
	components: {
		// TextInput,
	},
	name: "UserCard",
	props: {
		name: String,
		card_id: String,
	},
	created() {
		console.log("User card component added");
	},
	methods: {
		delete_card: async function () {
			/*
			console.log("Deleting card: " + this.card_id);

			let response = null;

			await fetch(window.BASE_URL + "/api/cards/delete", {
				method: "DELETE",
				headers: {
					"content-type": "application/json",
					"auth-token": this.$global.auth_token,
				},
				body: JSON.stringify({
					_id: this.card_id,
				}),
			})
				.then((text) => text.text())
				.then((r) => {
					response = JSON.parse(r);
					console.log("Result: ", response);
				});

			if (response && response.deleted) {
				console.log("Deleted sucessfully!");
				this.$root.$emit("deleted_global_card", this.card_id);
			}
			*/
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}

#card {
	padding: 5%;
	width: 80%;
	border: 1px solid black;
}

.button {
	margin-top: 15px;
	font-size: 13px;
	padding-top: 3px;
	padding-bottom: 3px;
	padding-right: 7px;
	padding-left: 7px;
	border: 1px solid black;
	-webkit-appearance: none;
	border-radius: 0;
}
</style>
