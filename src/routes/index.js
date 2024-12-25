const express = require("express");
const router = express.Router();
const middlewareAuth = require("../middleware/auth");
const middlewareCookie = require("../middleware/setCookieResponse");

// Import routes
const authRouter = require("./authRouter");
const usersRouter = require("./usersRouter");
const profileRouter = require("./profileRouter");

router.get("/", (req, res) => {
  res.redirect("/auth");
});

// Use other routes, no middleware required
router.use("/users", usersRouter);

// auth router, must logged in before use

router.use("/feed", require("./feedRouter"));

//router.use("/auth", middlewareCookie.setCookieResponse);
router.use("/auth", middlewareAuth.verifyRefreshToken, authRouter);

// profile router, must logged in before use
router.use("/profile", profileRouter);

//test router
router.get("/testToken", middlewareAuth.verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

module.exports = router;
