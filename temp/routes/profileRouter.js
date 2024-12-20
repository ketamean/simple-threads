const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "static/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + file.originalname + "-" + Date.now()+"." + file.mimetype.split("/")[1]);
    },
    fileFilter: (req, file, cb) => {
        if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 25 // 25MB
    }
});
const upload = multer({ storage: storage });
const profileController = require("../controllers/profileController");

router.get("/:id", profileController.getProfile);
router.post("/:id/followers", profileController.getFollowers);
router.post("/:id/followings", profileController.getFollowings);
router.post("/:id", upload.single('avatar'), profileController.updateProfile);
router.put("/:id/unfollow", profileController.unfollowUser);
router.put("/:id/follow", profileController.followUser);
module.exports = router;