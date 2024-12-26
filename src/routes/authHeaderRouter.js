const express = require("express");
const router = express.Router();

const notificationsRouter = require("./notificationsRouter");
const profileRouter = require("./profileRouter");

router.use("/notifications", notificationsRouter);
router.use('/profile', profileRouter);

module.exports = router;
