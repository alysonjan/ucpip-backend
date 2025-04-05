"use strict";
// src/utils/mailUtils.ts
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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create a transporter object using Mailtrap's SMTP settings
const transporter = nodemailer_1.default.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        // user: "e70818ffee8990", // ajax
        // pass: "b281192a00ddb2", // ajax
        user: "c059768b6f63af", // boss krei
        pass: "e5633234e17955", // boss krei
    },
});
// Function to send email
const sendEmail = (to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: "ucpip@admin.gmail.com",
        to,
        subject,
        text,
        html,
    };
    try {
        // Send mail
        const info = yield transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return info;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
});
exports.sendEmail = sendEmail;
