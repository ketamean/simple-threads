const express = require("express");
const userController = require("../controllers/userController");
const middleware = require("../middleware/auth");
const router = express.Router();

// Define user routes

//main auth
router.get("/", (req, res) => {
  res.render("index1");
});
router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);
router.get("/signOut", middleware.verifyToken, userController.signOut);

//reset password
router.post("/resetPassword", userController.resetPasswordRequest);
router.post("/validateOTP", userController.validateOTPAndResetPassword);

//reset accessToken
router.get("/resetToken", userController.resetAccessToken);

module.exports = router;
