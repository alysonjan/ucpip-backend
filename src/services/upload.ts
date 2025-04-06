// import multer from "multer";
// import path from "path";

// // Set up Multer storage and destination
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, "./public/Signatures");
//   },
//   filename: function (req, file, cb) {
//     return cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// // Initialize Multer
// export const upload = multer({ storage });

import multer from "multer";
import path from "path";
import { mkdirSync, chmodSync } from "fs";

// Use process.cwd() to reliably refer to the root of your project in production
const uploadDir = path.join(process.cwd(), "public", "Signatures");

// Create directory if it doesn’t exist and set permissions
try {
  mkdirSync(uploadDir, { recursive: true });
  chmodSync(uploadDir, 0o755);
  console.log(`Ensured directory exists with 755 permissions: ${uploadDir}`);
} catch (err) {
  console.error(`Failed to create or set permissions on ${uploadDir}:`, err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) or PDFs are allowed"));
    }
  },
});
