const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");

// Import other routes
const userRoutes = require("./user");
const feeds = require("./feeds");

// Use other routes
router.use("/users", userRoutes);

//homepage router
router.use("/", feeds);


//test router
router.get("/testToken", middleware.verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

router.get("/testOTP", middleware.verifyOTP, (req, res) => {
  res.json({
    message: "test otp thanh cong",
  });
});

module.exports = router;
