const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");

// Import other routes
const userRoutes = require("./user");

// Use other routes
router.use("/users", userRoutes);

router.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

router.get('/testToken', middleware.verifyToken, (req, res) => {
  res.json({ 
    message: 'You have accessed a protected route',
    user: req.user 
  });
});


module.exports = router;
