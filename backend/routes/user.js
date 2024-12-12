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
router.get("/signIn", userController.getSignIn);

//get - Sign Up
router.get("/signUp", userController.getSignUp);

//get - Rest Password
router.get("/resetPassword", userController.getResetPassword);

//post - signUp - signIn
router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);

//post - handle sign out
router.post("/signOut", middleware.verifyToken, userController.signOut);

//reset password
router.post("/auth/resetPassword", userController.resetPasswordRequest);
router.post("/auth/resetPass/link", userController.validateOTPAndResetPassword);

//update infor
router.post(
  "/updateProfile",
  upload.single("avatar"),
  userController.updateProfile
);

//reset accessToken
router.get("/resetToken", userController.resetAccessToken);

module.exports = router;
