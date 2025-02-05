const express = require("express");
const router = express.Router();

const feedRouter = require("./feedRouter");
const likeRouter = require("./likeRouter");
const commentsRouter = require("./commentsRouter");
const profileRouter = require("./profileRouter");
const notificationsRouter = require("./notificationsRouter");
const createPostRouter = require("./createPostRouter");

router.get("/", (req, res) => {
  res.redirect("/auth/feed");
});

router.use("/feed", feedRouter);
router.use("/like", likeRouter);
router.use("/comments", commentsRouter);
router.use("/create-post", createPostRouter);

router.use("/notifications", notificationsRouter);
router.use("/profile", profileRouter);

module.exports = router;
