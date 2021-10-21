const express = require('express');
const router = express.Router();
const Plans = require('../models/Plans');

router.get('/', async (req, res) => {
  try {
    const plans = await Plans.find({});
    res.json(plans);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/:pid', async (req, res) => {
  let pid = parseInt(req.params.pid);
  try {
    const plan = await Plans.findOne({ plan_id: pid });
    if (plan) {
      res.json(plan)
    } else {
      res.status(200).send({ status: "error", message: "Invalid plan selected" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router