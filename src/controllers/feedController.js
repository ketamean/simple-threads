const controllers = {};
const { md_feed } = require("../metadata");
const metadata = require("../metadata.js");
const { formatDistanceToNow } = require("date-fns");

controllers.getFeed = (req, res) => {
  console.log("feeds controller");
  res.locals.css = md_feed.css;
  res.locals.metadata = [
    {
      username: "A",
      avatarImagePath: "",
      date: "2024-01-01",
      dateDistance: formatDistanceToNow(new Date("2024-01-01")),
      postImagePaths: [],
      content: "hello",
      nLikes: "30",
      nComments: "20",
    },
    {
      username: "K",
      avatarImagePath: "",
      date: "2024-03-01",
      dateDistance: formatDistanceToNow(new Date("2024-03-01")),
      content: "hello",
      postImagePaths: ["/uploads/1.png", "/uploads/hehe.png"],
      nLikes: "30",
      nComments: "20",
    },
    {
      username: "B",
      avatarImagePath: "",
      date: "2024-02-01",
      dateDistance: formatDistanceToNow(new Date("2024-02-01")),
      content: "hello",
      postImagePaths: ["/uploads/1.png", "/uploads/hehe.png"],
      nLikes: "35",
      nComments: "20",
    },
  ];
  res.locals.tab_feed = true;
  res.render("feed");
};

controllers.createFeed = (req, res) => {
  res.locals.username = "vinhpham";
  res.locals.css = metadata.md_createPost.css || [];
  res.locals.tab_createPost = true;
  res.render("create-post");
};

module.exports = controllers;
