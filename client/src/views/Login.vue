<template>
    <div class="login">
        <h3>This is an Login page</h3>
        <div id="secure" v-if="!$global.logged_in">
            <input
                id="email_signin"
                ref="email_signin"
                type="email"
                name="email"
                placeholder="Email"
                autocomplete="off"
                required
            />
            <br />
            <input
                id="password_signin"
                ref="password_signin"
                type="password"
                name="password"
                placeholder="Password"
                autocomplete="off"
                required
            />
            <br />
            <input v-on:click="login" type="submit" value="Login" />
        </div>
    </div>
</template>

<script>
export default {
    name: "App",
    components: {},
    methods: {
        login: async function() {
            console.log("Submitted");
            const email = this.$refs.email_signin.value;
            const password = this.$refs.password_signin.value;
            console.log(email, password);

            await this.login_request(email, password);
        },
        login_request: async function(email, password) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                email: email,
                password: password,
            });

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            let r = null;

            try {
                await fetch(
                    "http://127.0.0.1:3000/api/user/login/",
                    requestOptions
                )
                    .then((response) => response.text())
                    .then((result) => {
                        result = JSON.parse(result);
                        //console.log("Result: " + JSON.stringify(result));
                        r = result;
                        this.$global.auth_token = result.token;
                    });
            } catch (err) {
                this.$global.logged_in = false;
            }

            if (r.logged_in) {
                this.$global.logged_in = true;
                window.localStorage.setItem(
                    "auth-token",
                    this.$global.auth_token
                );
                console.log("AUTH TOKEN", this.$global.auth_token);

                // Redirect to homepage
                this.$router.push("/");
            } else {
                this.$global.logged_in = false;
                this.$global.auth_token = "";
                alert(r.message);
            }
        },
    },

    data() {
        return {};
    },
    async created() {},
};
</script>
