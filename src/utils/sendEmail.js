const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, title) => {
  // 🔴 DEBUG (keep for now)
  console.log("SMTP ENV:", {
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS ? "OK" : "MISSING",
  });

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_PORT) || 587,
    secure: false, // correct for 587
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"DevTinder" <riyaaggarwal2206@gmail.com>',
    to,
    subject,
    html: `<h1>${title}</h1>`,
  });

  console.log("✅ Email accepted by SMTP:", info.messageId);
  return info;
};

module.exports = { sendEmail };
