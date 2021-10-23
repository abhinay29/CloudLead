require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Plans = require('../models/Plans');
const Payments = require('../models/Payments');
const User = require('../models/User');
const crypto = require("crypto");

router.post('/orders', async (req, res) => {

  let planId = req.body.planId
  const plan = await Plans.findOne({ plan_id: planId });

  if (!plan || plan.price_inr === 0) {
    return res.status(200).json({ status: "error", error: "Invalid plan selected" });
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: parseInt(plan.price_inr) * 100,
      currency: "INR",
      receipt: `${plan.plan_id}${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
})

router.post('/success', fetchuser, async (req, res) => {
  if (!req.user.id) {
    return res.status(200).json({ status: "Auth Fail" });
  }
  try {
    // getting the details back from our font-end
    const {
      name,
      email,
      contact,
      company,
      planId,
      receipt,
      amount,
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const plan = await Plans.findOne({ plan_id: planId });

    let body = orderCreationId + "|" + razorpayPaymentId;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    shasum.update(body.toString());

    const digest = shasum.digest("hex");

    // const digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, "w2lBtgmeuDUfnJVp43UpcaiT")

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    const transaction = await Payments.create({
      user: req.user.id,
      amount: amount,
      orderId: receipt,
      planId: planId,
      planName: plan.name,
      orderCreationId: orderCreationId,
      razorpayPaymentId: razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
      razorpaySignature: razorpaySignature,
      status: 'Completed',
    });

    if (transaction) {
      User.updateOne(
        { _id: req.user.id },
        { phone: contact, plan_id: planId, company: company },
        function (err, data) {
          if (err) {
            return res.status(200).json({ status: "error", error: err })
          }
        });
      res.status(200).json({ status: "success" });
    } else {
      res.json({ status: "error", error: "Something went wrong" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
})

module.exports = router
