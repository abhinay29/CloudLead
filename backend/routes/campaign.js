const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { sequenceList, templates, campaign } = require("../models/UserData");

require("dotenv").config();
const nodemailer = require("nodemailer");
const Contacts = require("../models/Contacts");

class APIMailer {
  constructor(host, user, pass, port, sender) {
    this.host = host;
    this.user = user;
    this.pass = pass;
    this.port = port;
    this.sender = sender;
  }
}

let SMTP_USER;
let SMTP_PASS;
let SMTP_PORT;
let SMTP_HOST;
let SMTP_SENDER;
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

router.get("/", async (req, res) => {
  const smtpSettings = async (id) => {
    try {
      const userData = await User.findOne({ _id: id });
      return userData.smtpSettings;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  try {
    const docs = await campaign.findOne({});
    if (docs) {
      let settings = await smtpSettings(docs.userId);
      SMTP_HOST = settings.smtp_host;
      SMTP_USER = settings.smtp_user;
      SMTP_PASS = settings.smtp_pass;
      SMTP_PORT = settings.smtp_port;
      SMTP_SENDER = settings.smtp_sender;
    }
    res.status(200).json({});
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
