const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const upload = require("../middleware/upload");

// Define user routes
router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);
router.get("/signOut", userController.signOut);
router.post("/resetPassword", userController.resetPasswordRequest);
router.post("/validateOTP", userController.validateOTPAndResetPassword);
router.post("/updateProfile", upload.single("avatar"), userController.updateProfile);
module.exports = router;
