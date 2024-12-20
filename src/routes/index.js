const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");

// Import routes
const userRoutes = require("./userRouter");
const feeds = require("./feedsRouter");
const profile = require("./feedsRouter");

// Use other routes
router.use("/users", userRoutes);

router.use("/profile", profile);

// auth router
router.use("/", middleware.verifyRefreshToken, feeds);

//test router
router.get("/testToken", middleware.verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

module.exports = router;
