require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const PlanModal = require("../models/Plans");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const transporter = require("../middleware/mailTransporter");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  "551396029089-1sm0epbfkpki0192mnb3e44qb6i66n1t.apps.googleusercontent.com"
);

const hostWebsite = process.env.APP_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const JWT_SECRET = process.env.JWT_SECRET;

const rand = () => Math.random(0).toString(36).substr(2);
const getToken = (length = 32) =>
  (rand() + rand() + rand() + rand()).substr(0, length);

function parseName(input) {
  var fullName = input || "";
  var result = {};

  if (fullName.length > 0) {
    var nameTokens = fullName.match(/\b(\w+)\b/g);

    if (nameTokens.length > 3) {
      result.name = nameTokens.slice(0, 2).join(" ");
    } else {
      result.name = nameTokens.slice(0, 1).join(" ");
    }

    if (nameTokens.length > 2) {
      result.lastName = nameTokens.slice(-2, -1).join(" ");
      result.secondLastName = nameTokens.slice(-1).join(" ");
    } else {
      result.lastName = nameTokens.slice(-1).join(" ");
      result.secondLastName = "";
    }
  }

  return result;
}

function genCustomerId(len = 16) {
  var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].reduce((a) => a + p[~~(Math.random() * p.length)], "");
}

router.post(
  "/signup",
  [
    // body("first_name", "Enter a valid fullname").isLength({ min: 3 }),
    // body("last_name", "Enter a valid fullname").isLength({ min: 1 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5
    })
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }

    var reqEmail = req.body.email;
    var domain = reqEmail.substring(reqEmail.lastIndexOf("@") + 1);

    if (domain === "gmail.com" || domain === "yahoo.com") {
      return res.status(200).json({
        status: "error",
        error: "Please use your official email address"
      });
    }

    let strongPassword = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");

    if (!strongPassword.test(req.body.password)) {
      return res.status(200).json({
        status: "error",
        error:
          "Password should contain at least 1 capital letter and 1 numeric value"
      });
    }

    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          status: "error",
          error: "Sorry a user with this email is already registered"
        });
      }

      let userPhone = await User.findOne({ phone: req.body.phone });
      if (userPhone) {
        return res.status(200).json({
          status: "error",
          error: "Sorry a user with this phone number is already registered."
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      let token = getToken(40);
      let customer_id = genCustomerId(8);

      // Create a new user
      user = await User.create({
        first_name: parseName(req.body.first_name).name,
        last_name: parseName(req.body.first_name).lastName,
        password: secPass,
        email: req.body.email,
        country_code: req.body.country_code,
        company: req.body.company,
        phone: req.body.phone,
        token: token,
        customer_id: customer_id
      });

      let info = await transporter.sendMail({
        from: `"Cloudlead" <${adminEmail}>`,
        to: req.body.email,
        subject: "Confirm your email address", // Subject line
        html: `<h5>Welcome to Cloudlead</h5>
        <p>Thank you for signing up!</p>
        <p>Please confirm your email address to start using Cloudlead.ai</p>
        <p><a href="${hostWebsite}/verify/${token}">${hostWebsite}/verify/${token}</a></p>
        <p></p>
        <p>Have a wonderful day!</p>
        <p>Team Cloudlead</p>
      `
      });
      res.json({ status: "success" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
  ],
  async (req, res) => {
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
        success = false;
        return res
          .status(200)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(200).json({
          success,
          error: "Please try to login with correct credentials"
        });
      }

      //Check if user is active
      if (user.status == 0) {
        let token = getToken(40);
        let info = await transporter.sendMail({
          from: `"Cloudlead" <${adminEmail}>`,
          to: req.body.email,
          subject: "Confirm your email address", // Subject line
          html: `<h5>Welcome to Cloudlead.ai- A lead prospecting platform!</h5>
          <p>Thank you for signing up!</p>
          <p>Please confirm your email address to start using Cloudlead.</p>
          <p><a href="${hostWebsite}/verify/${token}">${hostWebsite}/verify/${token}</a></p>
          <p>Have a wonderful day!</p>
          <p>Team Cloudlead</p>
        `
        });
        let UpdateToken = await User.findByIdAndUpdate(
          { _id: user._id },
          { token: token },
          { new: true }
        );
        return res.status(200).json({
          success,
          error:
            "Please verify your email address, we have sent you a confirmation email, please check your inbox."
        });
      }

      let lastLogin = "";

      if (user.loginHistory) {
        let history = user.loginHistory.length;
        if (history > 0) {
          lastLogin = user.loginHistory[history - 1].date;
          lastLogin = new Date(lastLogin);
          lastLogin = lastLogin.toLocaleString();
        }
      }

      let logLogin = await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { loginHistory: { date: Date.now() } } },
        { new: true }
      );

      const data = {
        user: {
          id: user.id
        }
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      const uemail = email;
      const uname = user.first_name + " " + user.last_name;
      res.json({ success, authtoken, uemail, uname, lastLogin });
    } catch (error) {
      console.error(error.message);
      res.status(401).send({ success: false, error: "Authentication failed." });
    }
  }
);

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    var userId = req.user.id;
    let user = await User.findById(userId).select([
      "-password",
      "-token",
      "-_id",
      "-__v",
      "-dateUnlockDaily"
    ]);
    let Plan = await PlanModal.findOne({
      plan_id: parseInt(user.plan_id)
    }).select(["-_id", "name"]);
    let userData = {};
    userData = user;
    let plan_name = Plan ? Plan.name : "None";
    userData = { ...user._doc, plan_name };
    res.status(200).send({
      status: "success",
      userdata: userData
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).send({ status: "error", error: "User not found" });
  }
});

router.post("/googlelogin", async (req, res) => {
  const tokenId = req.body.tokenId;
  let success = false;
  let customer_id = genCustomerId(8);
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "551396029089-1sm0epbfkpki0192mnb3e44qb6i66n1t.apps.googleusercontent.com"
    })
    .then(async (response) => {
      const { email_verified, given_name, family_name, email } =
        response.payload;

      // var domain = email.substring(email.lastIndexOf("@") + 1);

      // if (domain === "gmail.com" || domain === "yahoo.com") {
      //   return res.status(200).json({
      //     status: "error",
      //     error: "Please use your official email address"
      //   });
      // }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(email + JWT_SECRET, salt);

      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              status: "Failed",
              error: err
            });
          } else {
            if (user) {
              let lastLogin = "";

              if (user.loginHistory) {
                let history = user.loginHistory.length;
                if (history > 0) {
                  lastLogin = user.loginHistory[history - 1].date;
                  lastLogin = new Date(lastLogin);
                  lastLogin = lastLogin.toLocaleString();
                }
              }

              let logLogin = User.findOneAndUpdate(
                { _id: user._id },
                { $push: { loginHistory: { date: Date.now() } } },
                { new: true }
              );

              const data = {
                user: {
                  id: user.id
                }
              };
              const authtoken = jwt.sign(data, JWT_SECRET);
              success = true;
              const uemail = email;
              const uname = user.first_name + " " + user.last_name;
              return res
                .status(200)
                .json({ success, authtoken, uemail, uname, lastLogin });
            } else {
              let createUser = new User({
                first_name: given_name,
                last_name: family_name,
                password: secPass,
                email: email,
                token: "",
                status: 1,
                customer_id: customer_id
              });
              createUser.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    status: "Failed",
                    error: err
                  });
                } else {
                  const data = {
                    user: {
                      id: result.id
                    }
                  };
                  const authtoken = jwt.sign(data, JWT_SECRET);
                  success = true;
                  const uemail = email;
                  const uname = given_name + " " + family_name;
                  return res
                    .status(200)
                    .json({ success, authtoken, uemail, uname });
                }
              });
            }
          }
        });
      }
    });
});

router.post("/forgotpassword", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      let token = getToken(64);
      let UpdateToken = await User.findOneAndUpdate(
        { _id: user._id },
        { token: token },
        { new: true }
      );
      if (UpdateToken) {
        await transporter.sendMail({
          from: `"Cloudlead" <${adminEmail}>`,
          to: req.body.email,
          subject: "Reset your cloudlead account password",
          html: `<p>Dear User,</p>
            <p>Please click on following link to reset your account password.</p>
            <p><a href="${hostWebsite}/reset-password/${token}">${hostWebsite}/reset-password/${token}</a></p>
            <p>Have a wonderful day!</p>
            <p>Team Cloudlead</p>
            `
        });
        res.status(200).send({ status: "success" });
      }
    } else {
      res.status(200).send({ status: "error", error: "Incorrect Email" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send({ status: "error", error: "Incorrect Email" });
  }
});

router.post("/resetpassword", async (req, res) => {
  let user = await User.findOne({ token: req.body.token });

  if (!req.body.password) {
    return res.status(200).send({
      status: "error",
      error: "Password can not be blank"
    });
  }

  let strongPassword = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");

  if (!strongPassword.test(req.body.password)) {
    return res.status(200).json({
      status: "error",
      error:
        "Password should contain at least 1 capital letter and 1 numeric value"
    });
  }

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);

  if (user) {
    try {
      await User.updateOne(
        { _id: user._id },
        { password: secPass, token: "" },
        { upsert: true }
      );
    } catch (error) {
      console.log(error);
      return res.status(200).send({
        status: "error",
        error: "Sorry, cannot set password this time."
      });
    }

    try {
      await transporter.sendMail({
        from: `"Cloudlead" <${adminEmail}>`,
        to: user.email,
        subject: "Cloudlead account password reset successfully",
        html: `<p>Dear User,</p>
              <p>Your Cloudlead account password has been reset successfully.</p>
              <p>Have a wonderful day!</p>
              <p>Team Cloudlead</p>
            `
      });
    } catch (err) {
      console.log(err);
      res.status(200).send({ status: "error" });
    }
    res.status(200).send({ status: "success" });
  } else {
    res.status(200).send({
      status: "error",
      error: "Invalid link, please check email and click on link."
    });
  }
});

module.exports = router;
