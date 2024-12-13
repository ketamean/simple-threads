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

//post - signUp - signIn
router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);

//post - handle sign out
router.post("/signOut", middleware.verifyToken, userController.signOut);

//reset password
router.get("/auth/resetPassword", userController.getresetPasswordAsk);
router.post("/auth/resetPassword", userController.resetPasswordAsk);
router.get(
  "/auth/link/resetPass",
  middleware.verifyResetToken,
  userController.getResetPasswordSet
);
router.put(
  "/auth/link/resetPass",
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
