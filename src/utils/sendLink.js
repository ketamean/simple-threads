const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "simplethread2024@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendResetLink = (mail, token) => {
  const htmlPath = path.join(__dirname, "../public/resetPasswordTemplate.html");
  const htmlContent = fs.readFileSync(htmlPath, "utf8");

  const mailOptions = {
    from: "simplethread2024@gmail.com",
    to: mail,
    subject: "Your link to RESET PASSWORD",
    html: htmlContent.replace("{{token}}", token),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendVerificationLink = (mail, token) => {
  const htmlPath = path.join(__dirname, "../public/verifyEmailTemplate.html");
  const htmlContent = fs.readFileSync(htmlPath, "utf8");

  const mailOptions = {
    from: "simplethread2024@gmail.com",
    to: mail,
    subject: "Your link to VERIFY EMAIL",
    html: htmlContent.replace("{{token}}", token),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendResetLink , sendVerificationLink };

