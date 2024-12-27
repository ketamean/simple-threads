const express = require("express");
const router = express.Router();
const { getFeed, getFeedFollowing } = require("../controllers/feedController");

// Define user routes
router.get("/", getFeed);
router.get("/following", getFeedFollowing);

module.exports = router;
