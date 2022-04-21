require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Plans = require("../models/Plans");
const Payments = require("../models/Payments");
const User = require("../models/User");
const crypto = require("crypto");
const transporter = require("../middleware/mailTransporter");
const easyinvoice = require("easyinvoice");
const fs = require("fs");

const hostWebsite = process.env.APP_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/orders", async (req, res) => {
  const planId = req.body.planId;
  const annualBill = req.body.annualBill;

  let plan = await Plans.findOne({ plan_id: planId });

  if (!plan || plan.price_inr === 0) {
    return res
      .status(200)
      .json({ status: "error", error: "Invalid plan selected" });
  }

  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    let planAmount = 0;

    if (annualBill === 1) {
      planAmount = parseInt(plan.annual_price_inr);
    } else {
      planAmount = parseInt(plan.price_inr);
    }
    let cgst = (planAmount * 9) / 100;
    let sgst = (planAmount * 9) / 100;
    let totalAmount = planAmount + cgst + sgst;
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `${plan.plan_id}${Date.now()}`
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/success", fetchuser, async (req, res) => {
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
      country_code,
      address,
      city,
      state,
      country,
      pin,
      gst,
      gst_number,
      receipt,
      amount,
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature
    } = req.body;

    const plan = await Plans.findOne({ plan_id: planId });

    let body = orderCreationId + "|" + razorpayPaymentId;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    shasum.update(body.toString());

    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    const transaction = await Payments.create({
      name: name,
      email: email,
      user: req.user.id,
      amount: amount,
      orderId: receipt,
      planId: planId,
      planName: plan.name,
      orderCreationId: orderCreationId,
      razorpayPaymentId: razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
      razorpaySignature: razorpaySignature,
      status: "Completed"
    });

    if (transaction) {
      User.updateOne(
        { _id: req.user.id },
        {
          phone: contact,
          country_code: country_code,
          plan_id: planId,
          company: company,
          billing_info: {
            address: address,
            city: city,
            state: state,
            country: country,
            pin: pin,
            gst: gst,
            gst_number: gst_number
          }
        },
        function (err, data) {
          if (err) {
            return res.status(200).json({ status: "error", error: err });
          } else {
            let date = new Date(transaction.date);
            date = date.toLocaleString();

            const data = {
              currency: "INR",
              taxNotation: "GST",
              marginTop: 25,
              marginRight: 25,
              marginLeft: 25,
              marginBottom: 25,
              logo: "https://app.cloudlead.ai/cl_logo_192x192.png",
              // "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg", //or base64 //img or pdf
              sender: {
                company: "Cloudlead",
                address: "Baner",
                zip: "123123",
                city: "Pune",
                country: "India"
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
              },
              client: {
                company: company,
                address: address,
                zip: pin,
                city: city,
                country: country
                //"custom1": "custom value 1",
                //"custom2": "custom value 2",
                //"custom3": "custom value 3"
              },
              invoiceNumber: transaction.orderId,
              invoiceDate: date,
              products: [
                {
                  quantity: "12",
                  description: plan.name,
                  tax: 18,
                  price: plan.price_inr
                }
              ]
              // "bottomNotice": "Kindly pay your invoice within 15 days.",
            };

            easyinvoice.createInvoice(data, function (result) {
              transporter.sendMail({
                from: `"Cloudlead" <${adminEmail}>`,
                to: email,
                subject: `Subscription of "${transaction.planName}" plan detail`,
                html: `
                <p>Dear Customer,</p>
                <p>Thank you for choosing Cloudlead.</p>
                <p>You have subscribed "${transaction.planName}"</p>
                <p></p>
                <p>Have a wonderful day!</p>
                <p>Team Cloudlead</p>
              `,
                attachments: [
                  {
                    filename: transaction.orderId + ".pdf",
                    path: "data:application/pdf;base64," + result.pdf,
                    contentType: "application/pdf"
                  }
                ]
              });
            });

            res.status(200).json({ status: "success" });
          }
        }
      );
    } else {
      res.json({ status: "error", error: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/invoice", fetchuser, async (req, res) => {
  if (!req.user.id) {
    return res
      .status(200)
      .json({ status: "error", error: "Authentication failed" });
  }

  let orderId = req.body.orderId;

  const trans = await Payments.findOne({ user: req.user.id, orderId: orderId });

  if (!trans)
    return res
      .status(200)
      .json({ status: "error", error: "Transaction not found" });

  let date = new Date(trans.date);
  date = date.toLocaleString();

  let amount = trans.amount;
  let subTotal = (amount * 100) / 118;

  const data = {
    currency: "INR",
    taxNotation: "GST",
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    logo: "https://app.cloudlead.ai/cl_logo_192x192.png",
    // "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg", //or base64 //img or pdf
    sender: {
      company: "Cloudlead",
      address: "Baner",
      zip: "123123",
      city: "Pune",
      country: "India"
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    client: {
      company: "Client Corp",
      address: "Clientstreet 456",
      zip: "4567 CD",
      city: "Clientcity",
      country: "Clientcountry",
      custom1: "+91 1231231234"
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    invoiceNumber: trans.orderId,
    invoiceDate: date,
    products: [
      {
        quantity: "1",
        description: trans.planName,
        tax: 18,
        price: subTotal
      }
    ]
    // "bottomNotice": "Kindly pay your invoice within 15 days.",
  };

  easyinvoice.createInvoice(data, async function (result) {
    return res.status(200).json({ status: "success", pdf: result.pdf });
  });
});

module.exports = router;
