const nodemailer = require("nodemailer");
const { BREVO_HOST, BREVO_PORT, BREVO_USER, BREVO_PASS } = require("./constants");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: BREVO_HOST,
      port: BREVO_PORT,
      secure: false,
      auth: {
        user: BREVO_USER,
        pass: BREVO_PASS,
      },
    });

    await transporter.sendMail({
      from: `DevTinder <${BREVO_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

module.exports = sendEmail;
