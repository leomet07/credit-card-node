<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <div v-if="$global.logged_in">
            <h1>You are logged in!</h1>
            <ul id="example-1">
                <li v-for="card in cards" :key="card.name">
                    {{ card }}
                </li>
            </ul>

            <br />
            <form
                v-on:submit="create_global_card"
                id="add_global_card"
                autocomplete="off"
                action="#"
            >
                <input
                    id="global_card_name"
                    ref="global_card_name"
                    type="text"
                    name="global_card_name"
                    placeholder="name"
                    autocomplete="off"
                    required
                />
                <br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
    components: {},
    methods: {
        create_global_card: async function(e) {
            e.preventDefault();

            console.log("Submitted");
            if (this.$global.checked_token) {
                const name = this.$refs.global_card_name.value;
                const body = { name: name };

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
                    "http://127.0.0.1:3000/api/cards/create",
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
                    this.cards.push(response.card);
                }
            }
        },
    },
    data() {
        return {
            cards: [],
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
                const cards = await get_cards(auth_token);
                console.log(cards);
                this.cards = cards;
            }
            console.log("Done getting cards");
        });
    },
};

async function get_cards(auth_token) {
    var myHeaders = new Headers();
    myHeaders.append("auth-token", auth_token);

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    let cards = [];
    await fetch("http://127.0.0.1:3000/api/cards/", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            cards = result;
        })
        .catch((error) => console.log("error", error));
    cards = JSON.parse(cards);
    return cards;
}
</script>
<style scoped>
ul {
    list-style: none;
    margin-right: 5%;
}
</style>
