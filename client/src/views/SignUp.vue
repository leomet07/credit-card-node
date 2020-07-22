<template>
    <div class="login">
        <h2>Sign Up</h2>
        <div id="secure" v-if="!$global.logged_in">
            <TextInput
                id="email_signup"
                ref="email_signup"
                type="email"
                name="email"
                placeholder="Email"
                autocomplete="off"
                class="input"
                required
            />
            <br />
            <TextInput
                id="password_signup"
                ref="password_signup"
                type="password"
                name="password"
                placeholder="Password"
                autocomplete="off"
                class="input"
                required
            />
            <br />
            <TextInput
                id="name_signup"
                ref="name_signup"
                type="name"
                name="name"
                placeholder="Name"
                autocomplete="off"
                class="input"
                required
            />
            <br />
            <input
                v-on:click="signup"
                id="submit"
                type="submit"
                value="Login"
            />
        </div>
    </div>
</template>

<script>
import TextInput from "@/components/TextInput.vue";
export default {
    name: "App",
    components: { TextInput },
    methods: {
        signup: async function() {
            console.log("Submitted");
            const email = this.$refs.email_signup.$refs.text.value;
            const password = this.$refs.password_signup.$refs.text.value;
            const name = this.$refs.name_signup.$refs.text.value;
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
                    "http://192.168.7.36:3000/api/user/register/",
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
<style scoped>
.login {
    display: inline-block;
    width: 80%;
}

.input {
    display: inline-block;
    width: 100%;
    max-width: 500px;
}

#submit {
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
