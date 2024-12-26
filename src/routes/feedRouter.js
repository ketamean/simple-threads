const express = require("express");
const router = express.Router();
const { getFeed, createFeed } = require("../controllers/feedController");

// Define user routes
router.get("/", getFeed);

module.exports = router;
