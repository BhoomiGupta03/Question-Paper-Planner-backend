// utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials not properly configured");
    throw new Error("Email service configuration error");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This should be an App Password for Gmail
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", to);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;