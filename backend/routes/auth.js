require('dotenv').config();
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const transporter = require('../middleware/mailTransporter');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client("551396029089-1sm0epbfkpki0192mnb3e44qb6i66n1t.apps.googleusercontent.com");

const hostWebsite = process.env.APP_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const JWT_SECRET = process.env.JWT_SECRET;

const rand = () => Math.random(0).toString(36).substr(2);
const getToken = (length = 32) => (rand() + rand() + rand() + rand()).substr(0, length);

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

router.get('/getuser', fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select(["-password", "-token", "-_id", "-__v"])
    res.status(200).send({
      status: 'success',
      userdata: user
    })
  } catch (error) {
    console.error(error.message);
    res.status(400).send({ status: 'error', error: 'User not found' });
  }
})

router.post('/googlelogin', async (req, res) => {
  const tokenId = req.body.tokenId;
  let success = false;
  client.verifyIdToken({ idToken: tokenId, audience: "551396029089-1sm0epbfkpki0192mnb3e44qb6i66n1t.apps.googleusercontent.com" }).then(async (response) => {
    const { email_verified, given_name, family_name, email } = response.payload;

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(email + JWT_SECRET, salt);

    if (email_verified) {

      User.findOne({ email }).exec((err, user) => {
        if (err) {
          return res.status(400).json({
            status: "Failed",
            error: err,
          })
        } else {
          if (user) {
            const data = {
              user: {
                id: user.id
              }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;
            const uemail = email;
            const uname = user.first_name + " " + user.last_name;
            return res.status(200).json({ success, authtoken, uemail, uname })
          } else {
            let createUser = new User({
              first_name: given_name,
              last_name: family_name,
              password: secPass,
              email: email,
              token: "",
              status: 1,
            });
            createUser.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  status: "Failed",
                  error: err,
                })
              } else {
                const data = {
                  user: {
                    id: result.id
                  }
                }
                const authtoken = jwt.sign(data, JWT_SECRET);
                success = true;
                const uemail = email;
                const uname = given_name + " " + family_name;
                return res.status(200).json({ success, authtoken, uemail, uname })
              }
            })
          }
        }
      })
    }

  });
})



module.exports = router