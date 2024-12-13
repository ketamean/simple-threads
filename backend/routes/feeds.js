const express = require("express");
const feedController = require("../controllers/feedController");
const middleware = require("../middleware/auth");
const router = express.Router();

// Define user routes

//homepage (feed)
router.get("/", middleware.verifyRefreshToken, feedController.getFeed);

module.exports = router;
