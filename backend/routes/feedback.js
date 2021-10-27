require("dotenv").config();
const express = require("express");
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const transporter = require('../middleware/mailTransporter');

const hostWebsite = process.env.APP_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', fetchuser, async (req, res) => {
  console.log(req.body);
  res.status(200).send({ data: req.body });
})

module.exports = router