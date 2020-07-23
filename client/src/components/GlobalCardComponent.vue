<template>
	<div id="card">
		<p>{{ name }}</p>
		<button class="button" v-on:click="delete_card">Delete me</button>
		<form class="form" ref="form">
			<TextInput
				type="text"
				ref="name_update"
				placeholder="Update Name"
			/>
			<input
				class="button"
				v-on:click="update"
				id="submit"
				type="submit"
				value="Update"
			/>
		</form>
	</div>
</template>

<script>
import TextInput from "@/components/TextInput.vue";
export default {
	components: {
		TextInput,
	},
	name: "GlobalCard",
	props: {
		name: String,
		id: String,
	},
	methods: {
		update: async function(e) {
			e.preventDefault();
			console.log("Updated");
			console.log(this.$refs);
			const new_name = this.$refs.name_update.$refs.text.value;
			console.log({ new_name });

			let response = await fetch(window.BASE_URL + "/api/cards/update", {
				method: "PUT",
				headers: {
					"auth-token": this.$global.auth_token,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					_id: this.id,
					update: {
						name: new_name,
					},
				}),
			});
			response = await response.json();
			console.log(response);

			let response_loop = JSON.parse(
				JSON.stringify(response["changed_to"])
			);
			delete response_loop["_id"];
			delete response_loop["__v"];
			if (response.updated) {
				let keys = Object.keys(response_loop);

				for (let i = 0; i < keys.length; i++) {
					let key = keys[i];
					console.log("key: " + key);
					this[key] = response_loop[key];
				}
			}
		},
		delete_card: async function() {
			console.log("Deleting card " + this.id);

			let response = null;

			await fetch(window.BASE_URL + "/api/cards/delete", {
				method: "DELETE",
				headers: {
					"content-type": "application/json",
					"auth-token": this.$global.auth_token,
				},
				body: JSON.stringify({
					_id: this.id,
				}),
			})
				.then((text) => text.text())
				.then((r) => {
					response = JSON.parse(r);
					console.log("Result: ", response);
				});

			if (response && response.deleted) {
				console.log("Deleted sucessfully!");
				this.$root.$emit("deleted_global_card", this.id);
			}
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
