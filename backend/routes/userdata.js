const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { savedSearch, savedCompanySearch } = require('../models/UserData');

router.post('/savesearch', fetchuser, async (req, res) => {

  const user_id = req.user.id;

  try {

    try {

      let CheckUser = await savedSearch.findOne({ userId: user_id });
      let data = {
        name: req.body.name,
        query: req.body.query
      }
      let updateQuery = CheckUser.data;
      updateQuery.push(data);

      await savedSearch.findByIdAndUpdate(CheckUser._id, { $set: { data: updateQuery } }, { new: true })

      res.status(200).json({ status: "success" })

    } catch {
      console.log("Create")
      let CreateSearch = await savedSearch.create({
        userId: user_id,
        data: [{
          name: req.body.name,
          query: req.body.query
        }]
      });
      res.status(200).json({ status: "success" })
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/savedsearch', fetchuser, async (req, res) => {
  const user_id = req.user.id;
  try {
    let fetchSavedSearch = await savedSearch.findOne({ userId: user_id }).select(['data', '-_id']);
    res.status(200).json({
      status: "success",
      result: fetchSavedSearch
    })
  } catch (error) {
    res.status(202).json({
      msg: "saved search not found"
    });
  }
})

router.post('/savecompanysearch', fetchuser, async (req, res) => {

  const user_id = req.user.id;

  try {

    try {

      let CheckUser = await savedCompanySearch.findOne({ userId: user_id });
      let data = {
        name: req.body.name,
        query: req.body.query
      }
      let updateQuery = CheckUser.data;
      updateQuery.push(data);

      await savedCompanySearch.findByIdAndUpdate(CheckUser._id, { $set: { data: updateQuery } }, { new: true })

      res.status(200).json({ status: "success" })

    } catch {
      console.log("Create")
      let CreateSearch = await savedCompanySearch.create({
        userId: user_id,
        data: [{
          name: req.body.name,
          query: req.body.query
        }]
      });
      res.status(200).json({ status: "success" })
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/savedcompanysearch', fetchuser, async (req, res) => {
  const user_id = req.user.id;
  try {
    let fetchSavedSearch = await savedCompanySearch.findOne({ userId: user_id }).select(['data', '-_id']);
    res.status(200).json({
      status: "success",
      result: fetchSavedSearch
    })
  } catch (error) {
    res.status(202).json({
      msg: "saved search not found"
    });
  }
})

module.exports = router