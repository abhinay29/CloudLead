const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const User = require("../models/User");
const { sequenceList, templates, campaign } = require("../models/UserData");

router.get("/", async (req, res) => {
  try {
    let checkCampaign = campaign.findOne();
    if (!checkCampaign) {
      return res.status(200).send("Campaign Not Found");
    }

    console.log(checkCampaign);
  } catch (e) {
    console.log(e);
  }

  // if (1) {
  //   res.status(200).json({ status: true });
  // } else {
  //   res.status(200).json({ status: false });
  // }
});

// const adminEmail = process.env.ADMIN_EMAIL;
// const SMTP_USER = process.env.SMTP_USER;
// const SMTP_PASS = process.env.SMTP_PASS;
// const SMTP_PORT = process.env.SMTP_PORT;
// const SMTP_HOST = process.env.SMTP_HOST;
// const hostWebsite = process.env.APP_URL;

// let transporter;

// try {
//   transporter = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: SMTP_PORT,
//     secure: false,
//     // auth: {
//     //   user: SMTP_USER,
//     //   pass: SMTP_PASS,
//     // },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
// } catch (e) {
//   console.log(e);
// }

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

// module.exports = transporter;
