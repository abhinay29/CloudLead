const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Peoples = require('../models/Peoples');

router.get('/', async (req, res) => {
  try {
    let peoples = await Peoples.findOne().populate({ path: 'company_id' })
    if (peoples) {
      res.status(200).json(peoples);
    } else {
      res.status(200).json({ status: 'not found' });
    }
  } catch (e) {
    res.status(200).json({ status: 'not found' });
  }
})

module.exports = router