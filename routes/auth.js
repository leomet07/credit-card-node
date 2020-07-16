const router = require("express").Router();
const User = require("../model/User");
const {
    registerValidation,
    loginValidation
} = require("../validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const actionsRouter = require("./userActions").router;

// Register a user
router.post("/register", async (req, res) => {
    const validation = registerValidation(req.body);
    if ("error" in validation) {
        return res.status(200).end(
            JSON.stringify({
                message: validation.error.details[0].message,
                logged_in: false,
            })
        );
    }

    // Check if email exists in db
    const emailExist = await User.findOne({
        email: req.body.email,
    });

    if (emailExist) {
        return res.status(200).end(
            JSON.stringify({
                message: "Email already exists",
                logged_in: false,
            })
        );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    let savedUser;
    try {
        savedUser = await user.save();
    } catch (err) {}

    // Create and assaign a jwt
    const token = jwt.sign({
            _id: savedUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET
    );

    // Send the jwt token back.
    res.header("auth-token", token).send({
        token: token,
        logged_in: true,
    });
});

// Log in a user (Just send back their jwt so they can use private routes.)
router.post("/login", async (req, res) => {
    const validation = loginValidation(req.body);
    if ("error" in validation) {
        return res.status(200).end(
            JSON.stringify({
                logged_in: false,
                message: validation.error.details[0].message,
            })
        );
    }

    // Check if email exists in db
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        return res.status(200).end(
            JSON.stringify({
                logged_in: false,
                message: "Email doesnt exist",
            })
        );
    }

    // Check if password is correct.
    const valid_pass = await bcrypt.compare(req.body.password, user.password);

    if (!valid_pass) {
        return res.status(200).end(
            JSON.stringify({
                message: "Invalid password",
                logged_in: false,
            })
        );
    }

    // Create and assaign a jwt
    const token = jwt.sign({
            _id: user._id,
        },
        process.env.ACCESS_TOKEN_SECRET
    );
    res.header("auth-token", token).send({
        token: token,
        logged_in: true,
    });
});

// Verify a User's jwt so the browser can check if the logged in User in cache is correct.
router.get("/verify/:id", (req, res) => {
    let token = req.params.id;

    try {
        const verified = check_verify(token);
        console.log(verified)
        if (verified) {
            res.send({
                valid: true,
                _id: verified["_id"]
            });
        }
    } catch (err) {
        res.send({
            valid: false,
        });
    }
});
// Add routes for user to be able to interact with his/herself
router.use("/action", actionsRouter);

// Verify token
function check_verify(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}
module.exports = {
    router: router,
    check_verify: check_verify,
};