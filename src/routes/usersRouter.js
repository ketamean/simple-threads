// Define user routes: /users

const express = require("express");
const usersController = require("../controllers/usersController");
const middleware = require("../middleware/auth");
const router = express.Router();
const upload = require("../middleware/upload");

//get - login/Sign In
router.get("/", (req, res) => {
  res.redirect("/users/login");
});

// login
router.get("/login", usersController.getLogin);
router.post("/login", usersController.login);

// signup
router.get("/signup", usersController.getSignUp);
router.post("/signup", usersController.signUp);

// signout
router.post("/signout", usersController.signOut);

//reset-password
router.get("/reset-password", usersController.getresetPasswordAsk);
router.post("/reset-password", usersController.resetPasswordAsk);

// set-password
router.get(
  "/set-password",
  middleware.verifyResetToken,
  usersController.getResetPasswordSet
);
router.put(
  "/set-password",
  middleware.verifyResetToken,
  usersController.putResetPasswordSet
);

//reset accessToken
router.get("/resetToken", usersController.resetAccessToken);

module.exports = router;