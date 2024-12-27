const express = require("express");
const router = express.Router();

const createPostRouter = require("./createPostRouter");
const notificationsRouter = require("./notificationsRouter");
const profileRouter = require("./profileRouter");

router.use("/notifications", notificationsRouter);
router.use("/create-post", createPostRouter);
router.use("/profile", profileRouter);

module.exports = router;
