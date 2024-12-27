const express = require("express");
const router = express.Router();
const middlewareAuth = require("../middleware/auth");
const middlewareCookie = require("../middleware/setCookieResponse");

// Import routes
const authRouter = require("./authRouter");
const authHeaderRouter = require("./authHeaderRouter");
const usersRouter = require("./usersRouter");
const profileRouter = require("./profileRouter");

router.get("/", (req, res) => {
  res.redirect("/auth");
});

// Use other routes, no middleware required
router.use("/users", usersRouter);

// auth access router, must logged in before use
router.use("/auth-header", middlewareAuth.verifyToken, authHeaderRouter);


//router.use("/auth", middlewareCookie.setCookieResponse);
router.use(
  "/auth",
  //middlewareAuth.verifyToken,
  middlewareAuth.verifyRefreshToken,
  middlewareCookie.setCookieResponse,
  authRouter
);
module.exports = router;
