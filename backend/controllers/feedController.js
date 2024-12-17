const controllers = {};
const { md_feeds } = require("../metadata");

controllers.getFeed = (req, res) => {
  console.log("feeds controller");
  res.locals.css = md_feeds.css;
  res.locals.metadata = [
    {
      username: "A",
      avatarImagePath: "",
      date: "1/1/2024",
      content: "hello",
      postImagePaths: ["1.png", "hehe.png"],
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
  res.render("feeds");
};

module.exports = controllers;
