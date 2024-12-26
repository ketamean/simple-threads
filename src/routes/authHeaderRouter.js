const express = require("express");
const router = express.Router();

const notificationsRouter = require("./notificationsRouter");

router.use("/notifications", notificationsRouter);

module.exports = router;
