const express = require("express");
const router = express.Router();
// const fetchuser = require('../middleware/fetchuser');
const City = require("../models/City");

router.get("/:value", async (req, res) => {
  if (req.params.value === " ") {
    res.status(200).json({});
    return false;
  }
  try {
    const cities = await City.find({ name: new RegExp(req.params.value, "i") });
    const retVal = cities.map((city) => {
      return { label: city.name, value: city.name };
    });
    res.status(200).json(retVal);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
