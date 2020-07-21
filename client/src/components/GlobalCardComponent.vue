<template>
    <div id="card">
        <p>{{ name }} {{ id }}</p>
        <button v-on:click="delete_card">Delete me</button>
    </div>
</template>

<script>
export default {
    name: "GlobalCard",
    props: {
        name: String,
        id: String,
    },
    methods: {
        delete_card: async function() {
            console.log("Deleting card " + this.id);

            let response = null;

            await fetch("http://127.0.0.1:3000/api/cards/delete", {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    "auth-token":
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjEzMWU0YWU0ZGE0MDM4YTA0YTBkZWQiLCJpYXQiOjE1OTUwODg0NTh9.ye1NFmAYO25ryH4E8rjyV5MOnMDhBJ79r7bMi8l5ueE",
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
    width: 100%;
    border: 1px solid black;
}
</style>
