const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const expHbs = require("express-handlebars");
const app = express();

// Set up Handlebars
app.engine(
  "hbs",
  expHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layoutSurfing",
    defaultView: __dirname + "/views/pages",
  })
);

app.set("view engine", "hbs");

// app.use((req, res, next) => {
//   switch (req.path) {
//     case "/":
//       app.locals.layout = "main";
//       break;

//     default:
//       app.locals.layout = "user";
//       break;
//   }
//   next();
// });
// const hbs = exphbs.create({
//   layoutsDir: path.join(__dirname, "views/layouts"),
//   partialsDir: path.join(__dirname, "views/partials"),
//   defaultLayout: "main",
//   extname: "hbs",
// });

// app.engine("hbs", hbs.engine);
// app.set("view engine", "hbs");

//public folder
app.use(express.static(path.join(__dirname, "public"), { index: "home.html" }));
app.set("views", path.join(__dirname, "views"));

dotenv.config();
const port = process.env.PORT;

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

//middleware json
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
