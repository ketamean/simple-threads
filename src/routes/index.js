const express = require("express");
const router = express.Router();
const middlewareAuth = require("../middleware/auth");
const setResponseLocals = require('../middleware/setResponseLocals')

// Import routes
const authRouter = require("./authRouter");
const usersRouter = require("./usersRouter");

router.get('/', (req,res)  => {
  res.redirect('/auth')
})

// Use other routes, no middleware required
router.use("/users", usersRouter);

// auth router, must logged in before use
// router.use("/auth", setResponseLocals);
router.use("/auth", middlewareAuth.verifyRefreshToken, authRouter);

//test router
router.get("/testToken", middlewareAuth.verifyAccessToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user,
  });
});

module.exports = router;
