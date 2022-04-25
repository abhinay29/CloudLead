require("dotenv").config();
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const User = require("../models/User");
const { sequenceList, templates, campaign } = require("../models/UserData");
const Contacts = require("../models/Contacts");

class APIMailer {
  constructor(host, user, pass, port, sender) {
    this.host = host;
    this.user = user;
    this.pass = pass;
    this.port = port;
    this.sender = sender;
  }

  transporter() {
    try {
      let transporter = nodemailer.createTransport({
        host: this.host,
        port: this.port,
        secure: false,
        auth: {
          user: this.user,
          pass: this.pass
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      return transporter;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

let SMTP_USER;
let SMTP_PASS;
let SMTP_PORT;
let SMTP_HOST;
let SMTP_SENDER;

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
    const docs = await campaign.findOne({ sent: false });

    if (!docs) {
      return res.status(200).send("No campaign to send.");
    }

    let settings = await smtpSettings(docs.userId);
    // SMTP_HOST = settings.smtp_host;
    // SMTP_USER = settings.smtp_user;
    // SMTP_PASS = settings.smtp_pass;
    // SMTP_PORT = settings.smtp_port;
    // SMTP_SENDER = settings.smtp_sender;

    const mailer = new APIMailer(
      settings.smtp_host,
      settings.smtp_user,
      settings.smtp_pass,
      settings.smtp_port,
      settings.smtp_sender
    ).transporter();

    mailer.verify(function (error, success) {
      if (error) {
        return console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    let List = await sequenceList.findOne({
      _id: docs.list_id,
      userId: docs.userId
    });

    if (!List) {
      return res.status(200).send("List not found");
    }

    let templateData = await templates.findOne({
      _id: docs.template_id,
      userId: docs.userId,
      sent: false
    });

    try {
      List.list_data.map(async (contactId) => {
        let ContactData = await Contacts.findOne({ _id: contactId });

        await mailer.sendMail({
          from: `${settings.smtp_sender} <${settings.smtp_user}>`,
          to: ContactData.email,
          subject: templateData.template_subject,
          html: templateData.template_content
        });

        setTimeout(() => {
          console.log("Email sent to: ", ContactData.email);
        }, 5000);
      });
    } catch (e) {
      console.log(e);
    }

    await campaign.updateOne(
      {
        _id: docs._id
      },
      { $set: { sent: true } },
      { $upsert: true }
    );

    res.status(200).send("Campaign sent successfully");
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
