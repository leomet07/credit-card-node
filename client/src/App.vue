<template>
    <div id="app">
        <div id="nav">
            <span>
                &nbsp;
                <router-link class="link" to="/">Home</router-link>
                &nbsp;|</span
            >
            <span v-if="!$global.logged_in">
                &nbsp;
                <router-link class="link" to="/login">Login </router-link
                >&nbsp;|
            </span>
            <span v-if="!$global.logged_in">
                &nbsp;
                <router-link class="link" to="/signup">Sign Up </router-link>
                &nbsp;</span
            >
            <span v-if="$global.logged_in">
                &nbsp;
                <a class="link" href="#" v-on:click="logout">Logout</a>
                &nbsp;
            </span>
        </div>
        <router-view />
    </div>
</template>

<script>
export default {
    name: "App",
    components: {},
    methods: {
        logout: async function() {
            // logout
            localStorage.clear();
            this.$global.auth_token = "";
            this.$global.logged_in = false;
            // Redirect to login
            this.$router.push("login");
        },
    },

    data() {
        return {};
    },
    async created() {
        // console.log("App created");
        // console.log("My global in app: ", this.$global.message);
        let auth_token = window.localStorage.getItem("auth-token");
        console.log("Auth token:", auth_token);
        //let uid;
        if (auth_token) {
            let { valid, _id } = await verify_token(auth_token);
            console.log({ valid, _id });

            this.$global.logged_in = valid;
            this.$global.auth_token = auth_token;
            this.$global.checked_token = true;
            console.log("this.global in app", this.$global);
        }

        this.$root.$emit("checked_token");
    },
};

async function verify_token(token) {
    if (!token || token == "") {
        return {
            valid: false,
            msg: "token not valid",
        };
    }
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };
    let r = {
        valid: false,
    };
    await fetch(
        "http://192.168.7.36:3000/api/user/verify/" + token,
        requestOptions
    )
        .then((response) => response.text())
        .then((result) => {
            r = JSON.parse(result);
        })
        .catch((error) => console.log("error", error));

    return r;
}
</script>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav .link {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: underline;
}

#nav .link.router-link-exact-active {
    color: #42b983;
}
</style>
