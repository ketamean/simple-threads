const router = require("express").Router();
const loginController = require("../controllers/loginController");

router.get("/", loginController.show);
router.post("/", loginController.login);

module.exports = router;