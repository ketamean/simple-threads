const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// Define user routes
router.post("/signUp", userController.signUp);
router.post("/signIn", userController.signIn);
router.get("/signOut", userController.signOut);
module.exports = router;
