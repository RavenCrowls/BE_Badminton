const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, text, html) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, // your email address
      pass: process.env.EMAIL_PASSWORD, // your email password or app password
    },
  });

  let info = await transporter.sendMail({
    from: '"BadmintonWebsite" <no-reply@badminton.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html,
  });

  return info;
};

module.exports = {
  sendEmail,
};
