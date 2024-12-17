const express = require("express");
const expHbs = require("express-handlebars");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const {
	md_login,
	md_signup,
	md_resetPassword,
	md_feeds,
} = require("./metadata.js");
app.engine(
	"hbs",
	expHbs.engine({
		layoutsDir: __dirname + "/views/layouts",
		partialsDir: __dirname + "/views/partials",
		extname: "hbs",
		defaultLayout: "layoutSurfing",
		defaultView: __dirname + "/views/pages",
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
		},
	})
);
app.set("view engine", "hbs");
///////////////////////////
// Middlewares used for retrieving data from a POST request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Cookie middleware configuration
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:3000",
		credentials: true, // Enable cookies with CORS
	})
);

// Cookie default options
app.use((req, res, next) => {
	res.cookie("options", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		sameSite: "strict",
	});
	next();
});
///////////////////////////

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/static"));

// router
app.use("/", require("./routes/loginRouter"));
app.use("/profile", require("./routes/profileRouter"));

app.listen(port, () => {
	console.log("Server is listening on port ", port);
});