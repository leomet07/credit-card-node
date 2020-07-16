<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <div v-if="$global.logged_in">
            <h1>You are logged in!</h1>
            <ul id="example-1">
                <li v-for="card in cards" :key="card.name">
                    {{ card.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
    components: {},
    data() {
        return {
            cards: [],
        };
    },
    async created() {
        console.log("Created");

        // get token cuz it takes a second to load.
        const auth_token = localStorage.getItem("auth-token");
        if (auth_token && auth_token != "" && auth_token !== null) {
            const cards = await get_cards(auth_token);
            console.log(cards);
            this.cards = cards;
        }
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
