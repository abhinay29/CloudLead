const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const transporter = require('../middleware/mailTransporter');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { savedSearch, savedCompanySearch } = require('../models/UserData');

const adminEmail = process.env.ADMIN_EMAIL;

router.get('/', fetchuser, async (req, res) => {
  let Check = await User.findOne({ _id: req.user.id })
  if (Check.plan_id) {
    res.status(200).json({ status: true });
  } else {
    res.status(200).json({ status: false });
  }
})

router.post('/verify', async (req, res) => {
  // req.body.token
  let Check = await User.findOne({ token: req.body.token, status: 0 })
  if (Check) {
    await User.updateOne({ _id: Check._id }, { status: 1 });
    res.status(200).json({ status: true });
  } else {
    res.status(200).json({ status: false });
  }
})

router.post('/savesearch', fetchuser, async (req, res) => {

  const user_id = req.user.id;

  try {

    try {

      let CheckUser = await savedSearch.findOne({ userId: user_id });
      let data = {
        name: req.body.name,
        query: req.body.query
      }
      let updateQuery = CheckUser.data;
      updateQuery.push(data);

      await savedSearch.findByIdAndUpdate(CheckUser._id, { $set: { data: updateQuery } }, { new: true })

      res.status(200).json({ status: "success" })

    } catch {
      console.log("Create")
      let CreateSearch = await savedSearch.create({
        userId: user_id,
        data: [{
          name: req.body.name,
          query: req.body.query
        }]
      });
      res.status(200).json({ status: "success" })
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/savedsearch', fetchuser, async (req, res) => {
  const user_id = req.user.id;
  try {
    let fetchSavedSearch = await savedSearch.findOne({ userId: user_id }).select(['data', '-_id']);
    res.status(200).json({
      status: "success",
      result: fetchSavedSearch
    })
  } catch (error) {
    res.status(202).json({
      msg: "saved search not found"
    });
  }
})

router.post('/savecompanysearch', fetchuser, async (req, res) => {

  const user_id = req.user.id;

  try {

    try {

      let CheckUser = await savedCompanySearch.findOne({ userId: user_id });
      let data = {
        name: req.body.name,
        query: req.body.query
      }
      let updateQuery = CheckUser.data;
      updateQuery.push(data);

      await savedCompanySearch.findByIdAndUpdate(CheckUser._id, { $set: { data: updateQuery } }, { new: true })

      res.status(200).json({ status: "success" })

    } catch {
      console.log("Create")
      let CreateSearch = await savedCompanySearch.create({
        userId: user_id,
        data: [{
          name: req.body.name,
          query: req.body.query
        }]
      });
      res.status(200).json({ status: "success" })
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/savedcompanysearch', fetchuser, async (req, res) => {
  const user_id = req.user.id;
  try {
    let fetchSavedSearch = await savedCompanySearch.findOne({ userId: user_id }).select(['data', '-_id']);
    res.status(200).json({
      status: "success",
      result: fetchSavedSearch
    })
  } catch (error) {
    res.status(202).json({
      msg: "saved search not found"
    });
  }
})

router.post('/add-to-list', fetchuser, async (req, res) => {

  const user_id = req.user.id;

  try {

    try {

      let CheckUser = await savedSearch.findOne({ userId: user_id });
      let data = {
        name: req.body.name,
        query: req.body.query
      }
      let updateQuery = CheckUser.data;
      updateQuery.push(data);

      await savedSearch.findByIdAndUpdate(CheckUser._id, { $set: { data: updateQuery } }, { new: true })

      res.status(200).json({ status: "success" })

    } catch {
      // console.log("Create")
      let CreateSearch = await savedSearch.create({
        userId: user_id,
        data: [{
          name: req.body.name,
          query: req.body.query
        }]
      });
      res.status(200).json({ status: "success" })
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.post('/list/create', fetchuser, async (req, res) => {

  const user_id = req.user.id;

  console.log(req.body);

  res.status(200).json({ status: "success" });

  // try {



  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).send("Internal Server Error");
  // }
})

router.get('/checkphone/:phone', fetchuser, async (req, res) => {

  let user = await User.findOne({ phone: req.params.phone });
  if (user) {
    return res.status(200).json({ status: "error", error: "Sorry a user with this phone number is already exists" })
  } else {
    return res.status(200).json({ status: "success" })
  }
})

router.post('/subscribe', fetchuser, async (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { phone: req.body.phone, plan_id: req.body.plan, company: req.body.company },
    function (err, data) {
      if (err) {
        return res.status(200).json({ status: "error", error: err })
      } else {
        res.status(200).json({ status: "success" });
      }
    });
})

router.post('/update/profile', fetchuser, async (req, res) => {
  const { country_code, phone, company } = req.body
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { country_code, phone, company },
    function (err, data) {
      if (err) {
        return res.status(200).json({ status: "error", error: err })
      } else {
        res.status(200).json({ status: "success" });
      }
    });
})

router.post('/update/billing', fetchuser, async (req, res) => {
  const { address, city, state, country, pin, gst, gst_number } = req.body
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { billing_info: { address, city, state, country, pin, gst, gst_number } },
    function (err, data) {
      if (err) {
        return res.status(200).json({ status: "error", error: err })
      } else {
        res.status(200).json({ status: "success" });
      }
    });
})

router.post('/changepassword', fetchuser, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(200).json({ status: "error", error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(currentPassword, user.password);
    if (!passwordCompare) {
      return res.status(200).json({ status: "error", error: "Invalid current password." });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt);

    User.findByIdAndUpdate(
      { _id: req.user.id },
      { password: secPass },
      function (err, data) {
        if (err) {
          return res.status(200).json({ status: "error", error: err })
        } else {
          res.status(200).json({ status: "success" });
          transporter.sendMail({
            from: `"Cloudlead" <${adminEmail}>`,
            to: user.email,
            subject: "Confirmation: Password Changed", // Subject line
            html: `<h6>Dear Customer,</h6>
              <p>You have successfully change password for your account.</p>
              <p> </p>
              <p>Have a wonderful day!</p>
              <p>Team Cloudlead</p>
            `,
          });
        }
      });
  } catch (error) {
    console.error(error.message);
    res.status(401).send("Authentication failed.");
  }
})

module.exports = router