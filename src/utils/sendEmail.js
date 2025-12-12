const axios = require("axios");
const { BREVO_API } = require("./constants");

const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: "devtinder@example.com", name: "DevTinder" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": BREVO_API,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (err) {
    console.error("Email API error:", err.response?.data || err.message);
  }
};

module.exports = sendEmail;
