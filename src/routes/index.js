const express = require("express");
const router = express.Router();
const middleware = require("../middleware/auth");

// Import routes
const authRouter = require("./authRouter");

// Use other routes, no middleware required
router.use("/users", userRoutes);

// auth router, must logged in before use
router.use("/auth", middleware.verifyRefreshToken, authRouter);
router.get('/', (req,res)  => {
  res.redirect('/auth/feed')
})
//test router
router.get("/testToken", middleware.verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

module.exports = router;
