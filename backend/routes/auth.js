require('dotenv').config();
const express = require('express');
const nodemailer = require("nodemailer");
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_SECRET;

const adminEmail = process.env.ADMIN_EMAIL;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_HOST = process.env.SMTP_HOST;
const hostWebsite = process.env.APP_URL;

const rand = () => Math.random(0).toString(36).substr(2);
const getToken = (length = 32) => (rand() + rand() + rand() + rand()).substr(0, length);

let transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/signup', [
  body('first_name', 'Enter a valid name').isLength({ min: 3 }),
  body('last_name', 'Enter a valid name').isLength({ min: 1 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ status: "error", error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    let token = getToken(40);

    // Create a new user
    user = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: secPass,
      email: req.body.email,
      token: token,
    });

    let info = await transporter.sendMail({
      from: `"Cloudlead" <${adminEmail}>`,
      to: req.body.email,
      subject: "Confirm your email address", // Subject line
      html: `<h5>Welcome to Cloudlead</h5>
        <p>Thank you for signing up!</p>
        <p>Please confirm your email address to start using Prospect.​io.</p>
        <p><a href="${hostWebsite}/verify/${token}">${hostWebsite}/verify/${token}</a></p>
        <p></p>
        <p>Have a wonderful day!</p>
        <p>Team Cloudlead</p>
      `,
    });
    res.json({ 'status': 'success' })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(200).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(200).json({ success, error: "Please try to login with correct credentials" });
    }

    //Check if user is active
    if (user.status == 0) {
      let token = getToken(40);
      let info = await transporter.sendMail({
        from: `"Cloudlead" <${adminEmail}>`,
        to: req.body.email,
        subject: "Confirm your email address", // Subject line
        html: `<h5>Welcome to Cloudlead</h5>
          <p>Thank you for signing up!</p>
          <p>Please confirm your email address to start using Cloudlead.</p>
          <p><a href="${hostWebsite}/verify/${token}">${hostWebsite}/verify/${token}</a></p>
          <p>Have a wonderful day!</p>
          <p>Team Cloudlead</p>
        `,
      });
      let UpdateToken = await User.findByIdAndUpdate({ _id: user._id }, { token: token }, { new: true });
      return res.status(200).json({ success, error: "Please verify your email address, we have sent you a confirmation email, please check your inbox." });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    const uemail = email;
    const uname = user.first_name + " " + user.last_name;
    res.json({ success, authtoken, uemail, uname })

  } catch (error) {
    console.error(error.message);
    res.status(401).send("Authentication failed.");
  }


});


// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router