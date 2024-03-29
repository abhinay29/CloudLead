const express = require("express");
const router = express.Router();
const Plans = require("../models/Plans");

router.get("/", async (req, res) => {
  try {
    const plans = await Plans.find({}).limit(3).sort({ plan_id: 1 });
    res.json(plans);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:pid", async (req, res) => {
  let pid = parseInt(req.params.pid);
  if (!pid) {
    return res.status(200).json({
      status: "error",
      error: "Please provide currect plan information"
    });
  }
  try {
    const plan = await Plans.findOne({ plan_id: pid });
    if (plan) {
      res.json(plan);
    } else {
      res
        .status(200)
        .send({ status: "error", message: "Invalid plan selected" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ status: "error", error: "Internal Server Error" });
  }
});

module.exports = router;
