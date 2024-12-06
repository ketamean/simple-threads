const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "musicandchill201@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendOTP = (mail, OTP) => {
  const htmlPath = path.join(__dirname, "../public/otpTemplate.html");
  const htmlContent = fs.readFileSync(htmlPath, "utf8");

  const mailOptions = {
    from: "musicandchill201@gmail.com",
    to: mail,
    subject: "Your OTP Code",
    html: htmlContent.replace("{{OTP}}", OTP),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendOTP;
