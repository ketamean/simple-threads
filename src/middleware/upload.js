const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toUTCString().replaceAll(' ', '').replaceAll(':','-') + file.originalname);
    }
});
const upload = multer(
    { 
        storage: storage,
        fileFilter: (req, file, cb) => {
            let ext = file.originalname.split('.').pop();
            if (ext !== "jpg" && ext !== "jpeg" && ext !== "png" && ext !== "gif") {
                return cb(new Error("File type is not supported"), false);
            }
            cb(null, true);
        },
        limits: { 
            fileSize: 1024 * 1024 * 25 
        } // 25MB
    }
);

module.exports = upload;
