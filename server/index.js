const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors())
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

app.use(express.json());

// Only redirect to SSL if developer allows and states that machine running this has SSL to prevent crashes on computers without SSL
if (process.env.SSL == "true") {
	app.enable("trust proxy");

	app.use(function (req, res, next) {
		if (req.headers["x-forwarded-proto"] === "https") {
			return next();
		}
		res.redirect("https://" + req.headers.host + req.url);
	});
}
// Serve static files
app.use(express.static("public"));

// import Routes
const authRouter = require("./routes/auth").router;
const cardRouter = require("./routes/cards").router;

// Connect to db
mongoose.connect(
	process.env.DB_CONNECT, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	},
	() => {
		console.log("connected to db!");
	}
);

// Middleware

//Routes Middleware
app.use("/api/user", authRouter);
app.use("/api/cards", cardRouter);


const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("Sever is up and running at http://127.0.0.1:" + port);
});