let auth_token = "";
let logged_in = false;

window.onload = async function () {
    console.log("Loaded");

    auth_token = window.localStorage.getItem("auth-token");

    let {
        valid
    } = await verify_token(auth_token);

    logged_in = valid;

    update_auth_display(logged_in);

    if (auth_token && logged_in) {
        console.log("auth token found");

        use_cards(auth_token);
    }

    let login_form = document.querySelector("#sign_in");
    login_form.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("Submitted");

        let email = document.querySelector("#email_signin").value;
        let password = document.querySelector("#password_signin").value;
        console.log(email, password);

        await login_request(email, password);
    });
    let signup_form = document.querySelector("#sign_up");
    signup_form.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("Submitted");

        let email = document.querySelector("#email_signup").value;
        let password = document.querySelector("#password_signup").value;
        let name = document.querySelector("#name_signup").value;
        console.log(name, email, password);

        await signup_request(email, password, name);
    });

    let logout = document.querySelector("#logout");

    logout.addEventListener("click", function (e) {
        e.preventDefault();

        // logout
        localStorage.clear();
        auth_token = "";
        logged_in = false;

        update_auth_display(logged_in);
    });
    let global_card_form = document.querySelector("#add_global_card");

    global_card_form.addEventListener("submit", async function (e) {
        e.preventDefault();

        let global_card_name = document.querySelector("#global_card_name").value;


        await create_global_card({
            name: global_card_name
        }, auth_token)


    });
};



async function use_cards(auth_token) {
    const cards = await get_cards(auth_token);

    const global_cards_element = document.getElementById("global_cards")
    console.log("cards: ", cards);
    global_cards_element.innerHTML = "";

    cards.forEach((card) => {
        const imageElement = document.createElement('li');
        let text = "";
        for (key of Object.keys(card)) {

            key = String(key);
            if (key != "__v" && key != "_id") {
                let value = String(card[key]);
                value = value.replace("<", "&lt;");
                value = value.replace(">", "&gt;");
                value = value.replace("/", "&sol;");

                text += " ⊚  " + key + ": " + value
            }
        }
        imageElement.innerHTML = text;

        global_cards_element.append(imageElement);
    });


}

function update_auth_display(logged_in) {
    if (logged_in) {
        document.getElementById("signed_out").style.display = "none";
        document.getElementById("signed_in").style.display = "block";
    } else {
        document.getElementById("signed_out").style.display = "block";
        document.getElementById("signed_in").style.display = "none";
    }
}