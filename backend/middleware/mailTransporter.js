require("dotenv").config();
const nodemailer = require("nodemailer");

const adminEmail = process.env.ADMIN_EMAIL;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_HOST = process.env.SMTP_HOST;
const hostWebsite = process.env.APP_URL;

let transporter;

try {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    // auth: {
    //   user: SMTP_USER,
    //   pass: SMTP_PASS,
    // },
    tls: {
      rejectUnauthorized: false
    }
  });
} catch (e) {
  console.log(e);
}

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

module.exports = transporter;
