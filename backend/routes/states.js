const express = require('express');
const router = express.Router();
// const fetchuser = require('../middleware/fetchuser');
const State = require('../models/States');

router.get('/:value', async (req, res) => {
  if (req.params.value === ' ') {
    res.status(200).json({})
    return false;
  }
  try {
    const states = await State.find({ value: new RegExp(req.params.value, "i") })
    res.status(200).json(states)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router