const express = require("express");
const router = express.Router();

const createPostRouter = require("./createPostRouter");
const notificationsRouter = require("./notificationsRouter");

router.use("/notifications", notificationsRouter);
router.use("/create-post", createPostRouter);

module.exports = router;
