const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

if (process.env.SSL == "true") {
    app.enable("trust proxy");

    app.use(function (req, res, next) {
        if (req.headers["x-forwarded-proto"] === "https") {
            return next();
        }
        res.redirect("https://" + req.headers.host + req.url);
    });
}

app.use(express.static("public"));

// import Routes
const authRouter = require("./routes/auth").router;
const cardRouter = require("./routes/cards").router;

// Connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log("connected to db!");
    }
);

// Middleware

//Routes Middleware
app.use("/api/user", authRouter);
app.use("/api/cards", cardRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log("Sever is up and running");
});
