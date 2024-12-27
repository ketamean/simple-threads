const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const { decode } = require("base64-arraybuffer");

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_API_KEY
);
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let ext = file.originalname.split(".").pop();
    if (ext !== "jpg" && ext !== "jpeg" && ext !== "png" && ext !== "gif") {
      return cb(new Error("File type is not supported"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 25 },
});

const handleSupabaseUpload = async (files) => {
  const uploadedUrls = [];
  for (const file of files) {
    const buffer = decode(file.buffer.toString("base64"));
    const filename = `${Date.now()}-${file.originalname.replace(/\s/g, "")}`;

    const { data, error } = await supabase.storage
      .from("image_storage")
      .upload(filename, buffer);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("image_storage").getPublicUrl(filename);

    uploadedUrls.push(publicUrl);
  }
  return uploadedUrls;
};

module.exports = { upload, handleSupabaseUpload };
