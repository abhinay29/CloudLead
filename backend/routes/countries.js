const express = require("express");
const router = express.Router();
const Country = require("../models/Country");

router.get("/", async (req, res) => {
  try {
    const countries = await Country.find({});
    const retVal = countries.map((c) => {
      return { label: `${c.name} (${c.phone_code})`, value: c.phone_code };
    });
    res.status(200).json(retVal);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
