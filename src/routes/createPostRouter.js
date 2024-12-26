const express = require("express");
const router = express.Router();

const {
  getCreatePost,
  createPost,
} = require("../controllers/createPostController");

router.get("/", getCreatePost);

router.post("/", createPost);

module.exports = router;
