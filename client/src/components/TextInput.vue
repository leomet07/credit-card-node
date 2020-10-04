<template>
	<div>
		<div class="form">
			<input
				ref="text"
				:type="type"
				name="name"
				autocomplete="off"
				required
			/>
			<label for="name" class="label-name">
				<span class="content-name" ref="content-name">
					{{ placeholder }}
				</span>
			</label>
		</div>
	</div>
</template>

<script>
export default {
	props: ["name", "type", "placeholder"],
	name: "TextInput",
	methods: {},

	mounted() {
		// eslint-disable-next-line no-console
		//console.log("The props are also available in JS:", this.name);
	},
	computed: {},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins:500i&display=swap");
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

.form {
	width: 100%;
	position: relative;
	height: 50px;
	overflow: hidden;
}

.form input {
	width: 100%;
	height: 100%;
	color: #595f6e;
	padding-top: 30px;
	border: none;
	font-size: 16px;
	outline: none;
}

.form label {
	position: absolute;
	bottom: 0px;
	left: 0%;
	width: 100%;
	height: 100%;
	pointer-events: none;
	border-bottom: 1px solid black;
}

.form label::after {
	content: "";
	position: absolute;
	left: 0px;
	bottom: -1px;
	width: 100%;
	height: 100%;

	border-bottom: 2px solid #5fa8d3;
	transform: translateX(-100%);
	transition: all 0.3s ease;

	/*For better fps in animation if available */
	will-change: transform;
}

.content-name {
	position: absolute;
	bottom: 5px;
	left: 0px;
	transition: all 0.3s ease;
}

/* On form focus, affect the label */
.form input:focus + .label-name .content-name,
.form input:valid + .label-name .content-name {
	transform: translateY(-100%);
	font-size: 14px;
	color: #5fa8d3;
}

.form input:focus + .label-name::after,
.form input:valid + .label-name::after {
	transform: translateX(0%);
}
</style>
