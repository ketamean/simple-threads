const express = require("express");
const userController = require("../controllers/userController");
const middleware = require("../middleware/auth");
const router = express.Router();
const upload = require("../middleware/upload");

// Define user routes

//main auth
router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);
router.get("/signOut", middleware.verifyToken, userController.signOut);

//reset password
router.post("/resetPassword", userController.resetPasswordRequest);
router.post("/validateOTP", userController.validateOTPAndResetPassword);
<<<<<<< HEAD
router.post("/updateProfile", upload.single("avatar"), userController.updateProfile);
=======

//reset accessToken
router.get("/resetToken", userController.resetAccessToken);

>>>>>>> 926753982e25a0446fedc4297cc0574cb05bda52
module.exports = router;
