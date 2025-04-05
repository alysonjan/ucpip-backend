"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Set up Multer storage and destination
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/Signatures");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`);
    },
});
// Initialize Multer
exports.upload = (0, multer_1.default)({ storage });
