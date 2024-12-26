const controllers = {};
const Threads = require("../models/threadsModel");
const { formatISO } = require("date-fns");
const Users = require("../models/usersModel");

controllers.getCreatePost = async (req, res) => {
  console.log("create post controller");
  const userid = req.userID;
  const user = await Users.findById(userid);
  res.locals.username = user.username;
  res.locals.tab_createPost = true;
  res.render("create-post");
};

controllers.createPost = async (req, res) => {
  const { content } = req.body;
  const userID = req.userID;
  const images = req.files;
  const imagesPath = images.map((image) => {
    return (image.path = image.path.replace("public", ""));
  });
  console.log(imagesPath);
  try {
    const threadID = await Threads.createThread(
      userID,
      content,
      formatISO(new Date())
    );
    imagesPath.forEach(async (imagePath) => {
      await Threads.createThreadImage(threadID.id, imagePath);
    });
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = controllers;
