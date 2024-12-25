const express = require("express");
const router = express.Router();
const middlewareAuth = require("../middleware/auth");
const authenticator = require('../middleware/authenticate');
const tokenGrantor = require('../middleware/grantToken');
const setLocalsUserId = require('../middleware/setLocalsUserId');

// Import routes
const authRouter = require("./authRouter");
const usersRouter = require("./usersRouter");

router.get('/', (req,res)  => {
  res.redirect('/auth')
})

// Use other routes, no middleware required
router.use("/users", usersRouter);

// auth router, must logged in before use
// router.use(
//   "/auth",
//   authenticator.authAccessToken,
//   authenticator.authRefreshToken,
//   tokenGrantor.grantAuthTokens,
//   setLocalsUserId,
//   authRouter
// );

router.use('/auth', middlewareAuth.verifyRefreshToken, authRouter)

//test router
router.get("/testToken", middlewareAuth.verifyAccessToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

module.exports = router;
