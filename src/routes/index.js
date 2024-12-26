const express = require("express");
const router = express.Router();
const middlewareAuth = require("../middleware/auth");
const middlewareCookie = require('../middleware/setCookieResponse')

// Import routes
const authRouter = require("./authRouter");
const usersRouter = require("./usersRouter");

router.get('/', (req,res)  => {
  res.redirect('/auth')
})

// Use other routes, no middleware required
router.use("/users", usersRouter);

// auth router, must logged in before use

//router.use("/auth", middlewareCookie.setCookieResponse);
router.use(
  "/auth",
  // middlewareAuth.verifyToken,
  // middlewareAuth.verifyRefreshToken,
  middlewareCookie.setCookieResponse,
  authRouter
);

//test router
router.get("/testToken", middlewareAuth.verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

module.exports = router;
