import multer from "multer";
import path from "path";

// Set up Multer storage and destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/Signatures");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Initialize Multer
export const upload = multer({ storage });
