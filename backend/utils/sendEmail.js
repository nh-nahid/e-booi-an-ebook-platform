const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // fail fast if it can't even connect
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: "Welcome to Ebooi Book Store.",
      html,
    });
  } catch (err) {
    console.error("sendEmail failed:", err.message);
    throw err; // still bubbles up to the .catch() in createOrder — logged, not fatal
  }
}

module.exports = sendEmail;