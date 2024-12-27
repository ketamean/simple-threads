const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");

const {
  getCreatePost,
  createPost,
} = require("../controllers/createPostController");

router.get("/", getCreatePost);

router.post("/", upload.array("images", 10), createPost);

module.exports = router;
