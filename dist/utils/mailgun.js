"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail2 = void 0;
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const form_data_1 = __importDefault(require("form-data"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const mailgun = new mailgun_js_1.default(form_data_1.default);
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
});
const sendEmail2 = (to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `Ucpip2 <mailgun@${process.env.MAILGUN_DOMAIN}>`,
        to,
        subject,
        text,
        html,
    };
    try {
        // Send mail via Mailgun
        const info = yield mg.messages.create(process.env.MAILGUN_DOMAIN || "sandbox-123.mailgun.org", mailOptions);
        console.log(`Email sent: ${info.id}`);
        return info;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        // console.error("Error sending email:", error);
    }
});
exports.sendEmail2 = sendEmail2;
