const controllers = {};
const { md_feed } = require("../metadata");
const metadata = require("../metadata.js");

controllers.getFeed = (req, res) => {
  console.log("feeds controller");
  res.locals.css = md_feed.css;
  res.locals.metadata = [
    {
      username: "A",
      avatarImagePath: "",
      date: "1/1/2024",
      content: "hello",
      nLikes: "30",
      nComments: "20",
    },
    {
      username: "K",
      avatarImagePath: "",
      date: "1/1/2024",
      content: "hello",
      postImagePaths: ["1.png", "hehe.png"],
      nLikes: "30",
      nComments: "20",
    },
    {
      username: "B",
      avatarImagePath: "",
      date: "1/1/2024",
      content: "hello",
      postImagePaths: ["1.png", "hehe.png"],
      nLikes: "30",
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
