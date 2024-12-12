const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "static/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});
const upload = multer({ storage: storage });
const profileController = require("../controllers/profileController");

router.get("/:id", profileController.getProfile);
router.post("/:id", upload.single('avatar'), profileController.updateProfile);
router.put(":id/follow", profileController.followUser);
router.put(":id/unfollow", profileController.unfollowUser);
module.exports = router;