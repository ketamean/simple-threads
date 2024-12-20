// Define user routes: /users

const express = require("express");
const userController = require("../controllers/userController");
const middleware = require("../middleware/auth");
const router = express.Router();
const upload = require("../middleware/upload");

//get - login/Sign In
router.get("/", (req, res) => {
  res.redirect("users/signIn");
});

router.get("/signin", userController.getSignIn);

//get - Sign Up
router.get("/signup", userController.getSignUp);

//post - signUp - signIn
router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

//post - handle sign out
router.post("/signout", middleware.verifyToken, userController.signOut);

//reset password
router.get("/resetpassword", userController.getresetPasswordAsk);
router.post("/resetpassword", userController.resetPasswordAsk);
router.get(
  "/auth/setpassword",
  middleware.verifyResetToken,
  userController.getResetPasswordSet
);
router.put(
  "/auth/setpassword",
  middleware.verifyResetToken,
  userController.putResetPasswordSet
);

//update infor
router.post(
  "/updateProfile",
  upload.single("avatar"),
  userController.updateProfile
);

//reset accessToken
router.get("/resetToken", userController.resetAccessToken);

module.exports = router;
