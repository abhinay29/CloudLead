const express = require("express");
const router = express.Router();
// const fetchuser = require('../middleware/fetchuser');
const State = require("../models/States");

router.get("/:value", async (req, res) => {
  if (req.params.value === " ") {
    res.status(200).json({});
    return false;
  }
  try {
    const states = await State.find({
      name: new RegExp(req.params.value, "i")
    });
    const retVal = states.map((state) => {
      return { label: state.name, value: state.name };
    });
    res.status(200).json(retVal);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
