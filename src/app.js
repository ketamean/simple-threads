const express = require("express");
const expHbs = require("express-handlebars");
const Handlebars = require("handlebars");
const app = express();
const port = 3000;
const {
  md_login,
  md_signup,
  md_resetPassword,
  md_feeds,
} = require("./metadata.js");

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
  })
);
app.set("view engine", "hbs");
///////////////////////////
// Middlewares used for retrieving data from a POST request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
///////////////////////////

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/static"));

// router
app.use("/", require("./routes/loginRouter"));

// app.get('/', (req, res) => {
//     res.redirect('/login')
// })

// app.get('/login', (req, res) => {
//     res.locals.css = md_login.css
//     res.render('login', {layout: 'layoutWelcome'})
// })

// app.get('/signup', (req, res) => {
//     res.locals.css = md_signup.css
//     res.render('signup', {layout: 'layoutWelcome'})
// })

// app.get('/signup', (req, res) => {
//     res.render('signup', {layout: 'layoutWelcome'})
// })

// app.get('/reset-password', (req, res) => {
//     res.locals.css = md_resetPassword.css
//     res.render('reset-password-set', {layout: 'layoutWelcome'})
// })

// app.get('/feeds', (req, res) => {
//     res.locals.css = md_feeds.css
//     res.locals.metadata = [
//         {
//             username: 'A',
//             avatarImagePath: '',
//             date: '1/1/2024',
//             content: 'hello',
//             nLikes: '30',
//             nComments: '20'
//         },
//         {
//             username: 'K',
//             avatarImagePath: '',
//             date: '1/1/2024',
//             content: 'hello',
//             postImagePaths: ['1.png', 'hehe.png'],
//             nLikes: '30',
//             nComments: '20'
//         },
//         {
//             username: 'B',
//             avatarImagePath: '',
//             date: '1/1/2024',
//             content: 'hello',
//             postImagePaths: ['1.png', 'hehe.png'],
//             nLikes: '30',
//             nComments: '20'
//         }
//     ]
//     res.render('feeds')
// })

app.get("/feeds", (req, res) => {
  res.render("feeds");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

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
  ];
  res.render("activity", { layout: "layoutNotification" });
});

app.listen(port, () => {
  console.log("Server is listening on port ", port);
});
