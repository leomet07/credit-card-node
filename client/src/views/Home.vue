<template>
    <div class="home">
        <h1>Credit Card Search</h1>
        <div v-if="$global.logged_in">
            <h1>You are logged in!</h1>
            <div id="global_cards">
                <p v-for="cyclecard in cards" :key="cyclecard._id">
                    <GlobalCard
                        :ref="cyclecard._id"
                        class="global_card"
                        :id="cyclecard._id"
                        :name="cyclecard.name"
                    />
                </p>
            </div>

            <br />
            <form
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
    </div>
</template>

<script>
// @ is an alias to /src
import GlobalCard from "@/components/GlobalCardComponent.vue";
import TextInput from "@/components/TextInput.vue";

export default {
    name: "Home",
    components: { GlobalCard, TextInput },
    methods: {
        create_global_card: async function(e) {
            e.preventDefault();

            console.log("Submitted");
            if (this.$global.checked_token) {
                const name = this.$refs.global_card_name.$refs.text.value;
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
                    "http://192.168.7.36:3000/api/cards/create",
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

        this.$root.$on("deleted_global_card", async (id) => {
            console.log("Received a deltion of card:", id);
            let i = this.cards.map((card) => card._id).indexOf(id); // find index of your object
            this.cards.splice(i, 1); // remove it from array
        });
    },
};

async function get_cards(auth_token) {
    //var myHeaders = new Headers();
    let myHeaders = {};
    //myHeaders.append("Content-Type", "application/json");
    myHeaders["auth-token"] = auth_token;

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    let cards = [];
    await fetch("http://192.168.7.36:3000/api/cards/", requestOptions)
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
#global_cards {
    display: inline-block;
}
.input {
    display: inline-block;
    width: 100%;
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
</style>
