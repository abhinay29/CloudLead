const express = require('express');
const router = express.Router();
// const fetchuser = require('../middleware/fetchuser');
const City = require('../models/City');

router.get('/:value', async (req, res) => {
  if (req.params.value === ' ') {
    res.status(200).json({})
    return false;
  }
  try {
    const cities = await City.find({ value: new RegExp(req.params.value, "i") })
    res.status(200).json(cities)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router