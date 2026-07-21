// upload.middleware.js
import multer from "multer";
import ApiError from "../utils/ApiError.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — plenty for a phone photo, small enough for 3G upload

// Keep files in memory (buffer) — we stream straight to Cloudinary,
// never write to local disk. Fixes the earlier stray-file-on-disk problem.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Only JPEG, PNG, or WEBP images are allowed"),
      false,
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 2, // MVP scope: 1–2 photos per listing
  },
});

export default upload;
