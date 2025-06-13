const nodemailer = require("nodemailer");
const config = require("config");

const SMTP_USER = config.get("smpt_use");
const SMTP_PASS = config.get("smtp_password");
const SMTP_HOST = config.get("smtp_host");
const SMTP_PORT = config.get("smtp_port");
const API_URL = config.get("api_url");

async function sendActivationEmail(email, activationToken) {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const activationLink = `${API_URL}/users/activate/${activationToken}`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Welcome to TransportService 🎉</h2>
        <p style="font-size: 16px; color: #555;">Thank you for registering. Please click the button below to activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${activationLink}" style="background-color: #007BFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
            Activate Account
          </a>
        </div>
        <p style="font-size: 14px; color: #888;">If the button doesn’t work, copy and paste the following link in your browser:</p>
        <p style="font-size: 14px; color: #888;"><a href="${activationLink}" style="color: #007BFF;">${activationLink}</a></p>
        <hr style="margin: 40px 0;">
        <p style="font-size: 12px; color: #aaa;">If you didn't create an account, you can ignore this email.</p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"TransportService Team" <${SMTP_USER}>`,
      to: email,
      subject: "Activate Your TransportService Account",
      html: htmlContent,
    });

    console.log(`Activation email sent to ${email}`);
  } catch (err) {
    console.error("Error sending activation email:", err.message);
    throw err;
  }
}

module.exports = { sendActivationEmail };
