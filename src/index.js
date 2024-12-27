const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const expHbs = require("express-handlebars");
const Handlebars = require("handlebars");
const app = express();

const comparison = expHbs.create({
  compare: function (left, comparator, right) {
    if (eval(left + comparator + right)) {
      return true;
    } else {
      return false;
    }
  },
});

Handlebars.registerHelper("formatDate", function (datetime) {
  const now = new Date();
  const date = new Date(datetime);
  const diffInMs = now - date;
  const diffInMinutes = diffInMs / (1000 * 60);
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d`;
  } else {
    return date.toLocaleDateString("en-GB");
  }
});

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("add", function (a, b) {
  return a + b;
});

Handlebars.registerHelper("subtract", function (a, b) {
  return a - b;
});

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
    helpers: comparison,
  })
);

app.set("view engine", "hbs");

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
// app.use((req, res, next) => {
//   res.cookie("options", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     sameSite: "strict",
//   });
//   next();
// });

//middleware json
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
