// src/utils/mailUtils.ts

import nodemailer from "nodemailer";

// Create a transporter object using Mailtrap's SMTP settings
const transporter = nodemailer.createTransport({
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
export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  const mailOptions = {
    from: "ucpip@admin.gmail.com",
    to,
    subject,
    text,
    html,
  };

  try {
    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
