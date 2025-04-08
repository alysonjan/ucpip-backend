"use strict";
// import multer from "multer";
// import path from "path";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
// Use process.cwd() to reliably refer to the root of your project in production
const uploadDir = path_1.default.join(process.cwd(), "public", "Signatures");
// Create directory if it doesn’t exist and set permissions
try {
    (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
    (0, fs_1.chmodSync)(uploadDir, 0o755);
    console.log(`Ensured directory exists with 755 permissions: ${uploadDir}`);
}
catch (err) {
    console.error(`Failed to create or set permissions on ${uploadDir}:`, err);
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}_${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        }
        else {
            cb(new Error("Only images (jpeg, jpg, png) or PDFs are allowed"));
        }
    },
});
