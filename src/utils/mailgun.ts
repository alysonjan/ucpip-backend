import Mailgun from "mailgun.js";
import formData from "form-data";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
});

export const sendEmail2 = async (to: string, subject: string, text: string, html: string) => {
  const mailOptions = {
    from: `Ucpip2 <mailgun@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    // Send mail via Mailgun
    const info = await mg.messages.create(process.env.MAILGUN_DOMAIN || "sandbox-123.mailgun.org", mailOptions);
    console.log(`Email sent: ${info.id}`);
    return info;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    // console.error("Error sending email:", error);
  }
};
