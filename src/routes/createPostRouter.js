const express = require("express");
const router = express.Router();

const { getCreatePost } = require("../controllers/createPostController");

router.get("/", getCreatePost);

module.exports = router;
