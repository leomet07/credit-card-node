SS<template>
    <div class="login">
        <h1>This is an Login page</h1>
        <div id="secure" v-if="!$global.logged_in">
            <input
                id="email_signup"
                ref="email_signup"
                type="email"
                name="email"
                placeholder="Email"
                autocomplete="off"
                required
            />
            <br />
            <input
                id="password_signup"
                ref="password_signup"
                type="password"
                name="password"
                placeholder="Password"
                autocomplete="off"
                required
            />
            <br />
            <input
                id="name_signup"
                ref="name_signup"
                type="name"
                name="name"
                placeholder="Name"
                autocomplete="off"
                required
            />
            <br />
            <input v-on:click="signup" type="submit" value="Login" />
        </div>
    </div>
</template>

<script>
export default {
    name: "App",
    components: {},
    methods: {
        signup: async function() {
            console.log("Submitted");
            const email = this.$refs.email_signup.value;
            const password = this.$refs.password_signup.value;
            const name = this.$refs.name_signup.value;
            console.log(email, password, name);

            await this.signup_request(email, password, name);
        },
        signup_request: async function(email, password, name) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                email: email,
                password: password,
                name: name,
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
                    "http://127.0.0.1:3000/api/user/register/",
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
