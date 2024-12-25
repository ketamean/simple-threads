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

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
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

//test activity

app.get("/activity", (req, res) => {
  res.locals.metadata = [
    {
      img: "/1",
      username: "Quoc Khoi",
      date: "12/10/24",
      describe: "Followed you",
      content: "Follow",
      type: "Follow",
      is_read: false,
    },
    {
      img: "/1",
      username: "Quoc Khoi 2",
      date: "12/10/23",
      describe: "Followed you",
      content: "Follow",
      type: "Follow",
      is_read: false,
    },
    {
      img: "/1",
      username: "Quoc Khoi 33333333333333333333333",
      date: "12/10/23",
      describe: "Followed you",
      content: "Follow back",
      type: "Follow",
      is_read: true,
    },
    {
      img: "/2",
      username: "Quoc Khoi",
      date: "12/10/24",
      describe: "Post their first thread",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum assumenda laudantium similique quae, undeconsectetur aliquam modi illo, placeat optio numquam nulla quisquam velit sed sequi laborum vero et",
      type: "Content",
      is_read: true,
    },
    {
      img: "/2",
      username: "Quoc Khoi",
      date: "12/10/24",
      describe: "Post their first thread",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum assumenda laudantium similique quae, undeconsectetur aliquam modi illo, placeat optio numquam nulla quisquam velit sed sequi laborum vero et",
      type: "Content",
      is_read: true,
    },
    {
      img: "/2",
      username: "Quoc Khoi",
      date: "12/10/24",
      describe: "Post their first thread",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum assumenda laudantium similique quae, undeconsectetur aliquam modi illo, placeat optio numquam nulla quisquam velit sed sequi laborum vero et",
      type: "Content",
      is_read: true,
    },
  ];
  res.locals.tab_notifications = true;
  res.render("activity", { layout: "layoutNotification" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
