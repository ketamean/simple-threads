const controllers = {};
const Threads = require("../models/threadsModel");
const { formatISO } = require("date-fns");
const Users = require("../models/usersModel");
const { handleSupabaseUpload } = require("../middleware/upload");
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
  try {
    const imageUrls = req.files ? await handleSupabaseUpload(req.files) : [];
    const threadID = await Threads.createThread(
      userID,
      content,
      formatISO(new Date())
    );
    imageUrls.forEach(async (imagePath) => {
      console.log(imagePath);
      await Threads.createThreadImage(threadID.id, imagePath);
    });
    res.status(201).json({ message: "Post created successfully" });
    console.log("Post created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = controllers;
