const nodemailer =require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: process.env.BREVO_PORT,
  secure: false, // MUST be false for 587
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});
const sendEmail = async (to) => {
  await transporter.sendMail({
 from: '"DevTinder" <riyaaggarwal2206@gmail.com>',
    to: to,
    subject: "Welcome!",
    html: "<h2>Connection request sent successfully 🎉</h2>",
  });
};
module.exports={sendEmail};
