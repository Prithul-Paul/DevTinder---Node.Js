const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_AUTH_USR,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
});

module.exports = {
    transporter
}