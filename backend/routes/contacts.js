const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Contacts = require('../models/Contacts');
const Watchlist = require('../models/Watchlist');
const { body, validationResult } = require('express-validator');

class ConvertStringRegex {
  constructor(str) {
    this.str = str;
  }

  convertStr() {
    let convertedStr = '';
    for (var x = 0; x < this.str.length; x++) {
      if ((x + 1) == this.str.length) {
        convertedStr += this.str[x];
      } else {
        convertedStr += this.str[x] + '|';
      }
    }
    return convertedStr;
  }
}

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    let queryobj = { ...this.queryString };
    const excludefields = ['page', 'sort', 'limit'];
    excludefields.forEach(el => delete queryobj[el]);

    let querystr = JSON.stringify(queryobj);
    querystr = querystr.replace(
      /\b(gte|gt|lt|lte)\b/g,
      match => `$${match}`
    );

    this.query.find(JSON.parse(querystr));
    return this;
  }
  // sorting() { }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    let newLimit;
    if (limit === 25 || limit === 50 || limit === 100) {
      newLimit = limit;
    } else {
      newLimit = 50;
    }
    const skip = (page - 1) * newLimit;
    this.query = this.query.skip(skip).limit(newLimit);
    return this;
  }

  // distinct() {
  //   this.query = this.query.distinct('company_name');
  //   return this;
  // }

  // count() {
  //   this.query = this.query.count();
  //   return this;
  // }
}

// ROUTE 1: Seach Contacts using: GET "/". Login required
router.get('/', fetchuser, async (req, res) => {
  // router.get('/', async (req, res) => {
  if (
    req.query.first_name ||
    req.query.last_name ||
    req.query.company_name ||
    req.query.position ||
    req.query.industry ||
    req.query.company_size_range ||
    req.query.department ||
    req.query.role ||
    req.query.person_country ||
    req.query.person_state ||
    req.query.person_city ||
    req.query.company_country ||
    req.query.company_state ||
    req.query.company_city ||
    req.query.seniority_level ||
    req.query.company_type ||
    req.query.keyword ||
    req.query.domain ||
    req.query.revenue_range ||
    req.query.product_services
  ) {
    // Nothing happen here jump to try {} catch {}
  } else {
    return res.status(200).json({
      status: 'error',
      msg: "Invalid query string"
    });
  }

  // let reqQuery = JSON.stringify(req.query);

  // let keysForDel = [];
  // reqQuery.forEach((v, k) => {
  //   if (v === '')
  //     keysForDel.push(k);
  // });
  // keysForDel.forEach(k => {
  //   reqQuery.delete(k);
  // });

  // console.log(req.query);

  let newQuery = {};

  if (req.query.page) {
    newQuery.page = req.query.page;
  }
  if (req.query.sort) {
    newQuery.sort = req.query.sort;
  }
  if (req.query.limit) {
    newQuery.limit = req.query.limit;
  }

  if (req.query.first_name && req.query.first_name !== '') {
    if (req.query.first_name instanceof Array) {
      if (req.query.first_name.length > 0) {
        //   // newQuery.first_name = { $regex: req.query.first_name[0], $options: 'i' }
        // } else {
        let regexFirstName = new ConvertStringRegex(req.query.first_name).convertStr();
        newQuery.first_name = { $regex: regexFirstName, $options: 'i' }
      }
    } else {
      newQuery.first_name = { $regex: req.query.first_name, $options: 'i' }
    }
  }

  if (req.query.last_name && req.query.last_name !== '') {
    if (req.query.last_name instanceof Array) {
      if (req.query.last_name.length > 0) {
        //   newQuery.last_name = { $regex: req.query.last_name[0], $options: 'i' }
        // } else {
        let regexLastName = new ConvertStringRegex(req.query.last_name).convertStr();
        newQuery.last_name = { $regex: regexLastName, $options: 'i' }
      }
    } else {
      newQuery.last_name = { $regex: req.query.last_name, $options: 'i' }
    }
  }
  if (req.query.industry && req.query.industry !== '') {
    if (req.query.industry instanceof Array) {
      if (req.query.industry.length == 0) {
        newQuery.industry = { $regex: req.query.industry[0], $options: 'i' }
      } else {
        let regexIndustries = new ConvertStringRegex(req.query.industry).convertStr();
        newQuery.industry = { $regex: regexIndustries, $options: 'i' }
      }
    } else {
      newQuery.industry = { $regex: req.query.industry, $options: 'i' }
    }
  }
  if (req.query.company_name && req.query.company_name !== '') {
    if (req.query.company_name instanceof Array) {
      if (req.query.company_name.length > 0) {
        //   newQuery.company_name = { $regex: req.query.company_name[0], $options: 'i' }
        // } else {
        let regexCompName = new ConvertStringRegex(req.query.company_name).convertStr();
        newQuery.company_name = { $regex: regexCompName, $options: 'i' }
      }
    } else {
      newQuery.company_name = { $regex: req.query.company_name, $options: 'i' }
    }
  }
  if (req.query.position && req.query.position !== '') {
    if (req.query.position instanceof Array) {
      if (req.query.position.length == 1) {
        newQuery.position = { $regex: req.query.position[0], $options: 'i' }
      } else {
        let regexPosition = new ConvertStringRegex(req.query.position).convertStr();
        newQuery.position = { $regex: regexPosition, $options: 'i' }
      }
    } else {
      newQuery.position = { $regex: req.query.position, $options: 'i' }
    }
  }
  if (req.query.company_size_range && req.query.company_size_range !== '') {
    if (req.query.company_size_range instanceof Array) {
      let regexCompSize = new ConvertStringRegex(req.query.company_size_range).convertStr();
      newQuery.company_size_range = { $regex: regexCompSize, $options: 'i' }
    } else {
      newQuery.company_size_range = { $regex: req.query.company_size_range, $options: 'i' }
    }
  }
  if (req.query.company_type && req.query.company_type !== '') {
    if (req.query.company_type instanceof Array) {
      let regexCompType = new ConvertStringRegex(req.query.company_type).convertStr();
      newQuery.company_type = { $regex: regexCompType, $options: 'i' }
    } else {
      newQuery.company_type = { $regex: req.query.company_type, $options: 'i' }
    }
  }
  if (req.query.seniority_level && req.query.seniority_level !== '') {
    if (req.query.seniority_level instanceof Array) {
      let regexSrLevel = new ConvertStringRegex(req.query.seniority_level).convertStr();
      newQuery.seniority_level = { $regex: regexSrLevel, $options: 'i' }
    } else {
      newQuery.seniority_level = { $regex: req.query.seniority_level, $options: 'i' }
    }
  }
  if (req.query.keyword && req.query.keyword !== '') {
    if (req.query.keyword instanceof Array) {
      let regexKeyword = new ConvertStringRegex(req.query.keyword).convertStr();
      newQuery.keyword = { $regex: regexKeyword, $options: 'i' }
    } else {
      newQuery.keyword = { $regex: req.query.keyword, $options: 'i' }
    }
  }
  if (req.query.domain && req.query.domain !== '') {
    if (req.query.domain instanceof Array) {
      let regexDomain = new ConvertStringRegex(req.query.domain).convertStr();
      newQuery.domain = { $regex: regexDomain, $options: 'i' }
    } else {
      newQuery.domain = { $regex: req.query.domain, $options: 'i' }
    }
  }
  if (req.query.company_city && req.query.company_city !== '') {
    if (req.query.company_city instanceof Array) {
      let regexCompCity = new ConvertStringRegex(req.query.company_city).convertStr();
      newQuery.company_city = { $regex: regexCompCity, $options: 'i' }
    } else {
      newQuery.company_city = { $regex: req.query.company_city, $options: 'i' }
    }
  }
  if (req.query.company_state && req.query.company_state !== '') {
    if (req.query.company_state instanceof Array) {
      let regexCompState = new ConvertStringRegex(req.query.company_state).convertStr();
      newQuery.company_state = { $regex: regexCompState, $options: 'i' }
    } else {
      newQuery.company_state = { $regex: req.query.company_state, $options: 'i' }
    }
  }
  if (req.query.company_country && req.query.company_country !== '') {
    if (req.query.company_country instanceof Array) {
      let regexCompCountry = new ConvertStringRegex(req.query.company_country).convertStr();
      newQuery.company_country = { $regex: regexCompCountry, $options: 'i' }
    } else {
      newQuery.company_country = { $regex: req.query.company_country, $options: 'i' }
    }
  }
  if (req.query.person_city && req.query.person_city !== '') {
    if (req.query.person_city instanceof Array) {
      let regexPersCity = new ConvertStringRegex(req.query.person_city).convertStr();
      newQuery.person_city = { $regex: regexPersCity, $options: 'i' }
    } else {
      newQuery.person_city = { $regex: req.query.person_city, $options: 'i' }
    }
  }
  if (req.query.person_state && req.query.person_state !== '') {
    if (req.query.person_state instanceof Array) {
      let regexPersState = new ConvertStringRegex(req.query.person_state).convertStr();
      newQuery.person_state = { $regex: regexPersState, $options: 'i' }
    } else {
      newQuery.person_state = { $regex: req.query.person_state, $options: 'i' }
    }
  }
  if (req.query.person_country && req.query.person_country !== '') {
    if (req.query.person_country instanceof Array) {
      let regexPersCountry = new ConvertStringRegex(req.query.person_country).convertStr();
      newQuery.person_country = { $regex: regexPersCountry, $options: 'i' }
    } else {
      newQuery.person_country = { $regex: req.query.person_country, $options: 'i' }
    }
  }
  if (req.query.department && req.query.department !== '') {
    if (req.query.department instanceof Array) {
      let regexDepart = new ConvertStringRegex(req.query.department).convertStr();
      newQuery.department = { $regex: regexDepart, $options: 'i' }
    } else {
      newQuery.department = { $regex: req.query.department, $options: 'i' }
    }
  }

  if (req.query.role && req.query.role !== '') {
    if (req.query.role instanceof Array) {
      let regexRole = new ConvertStringRegex(req.query.role).convertStr();
      newQuery.role = { $regex: regexRole, $options: 'i' }
    } else {
      newQuery.role = { $regex: req.query.role, $options: 'i' }
    }
  }

  if (req.query.product_services && req.query.product_services !== '') {
    if (req.query.product_services instanceof Array) {
      let regexServices = new ConvertStringRegex(req.query.product_services).convertStr();
      newQuery.product_services = { $regex: regexServices, $options: 'i' }
    } else {
      newQuery.product_services = { $regex: req.query.product_services, $options: 'i' }
    }
  }
  if (req.query.revenue_range && req.query.revenue_range !== '') {
    if (req.query.revenue_range instanceof Array) {
      // let regexRevenueRange = new ConvertStringRegex(req.query.revenue_range).convertStr();
      newQuery.revenue_range = { $in: req.query.revenue_range }
    } else {
      newQuery.revenue_range = req.query.revenue_range
    }
  }

  console.log(newQuery);

  try {
    const features = new APIfeatures(Contacts.find().select(['_id',
      'first_name',
      'last_name',
      'linkedin_profile',
      'company_name',
      'website',
      'linkedin_link',
      'position',
      'industry',
      'company_size_range',
      'boardline_numbers',
      'person_country',
      'person_city',
      'company_country',
      'company_city',
      'seniority_level',
      'product_services']), newQuery)
      .filtering()
      .paginating();
    const contacts = await features.query;
    // const totalContacts = await Contacts.count({});
    const totalResults = await Contacts.count(newQuery);
    const uniqueComp = await Contacts.find(newQuery).distinct('company_name');
    // let reqLimit = 50;
    // if (req.query.limit) {
    //   reqLimit = parseInt(req.query.limit);
    // }

    res.status(200).json({
      status: 'success',
      // total: totalContacts,
      totalResults: totalResults,
      limit: contacts.length,
      page: req.query.page,
      uniqueCompany: uniqueComp.length,
      data: {
        contacts
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


router.post('/unlock', fetchuser, async (req, res) => {
  try {
    const { cid } = req.body;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const watchlist = new Watchlist({
      user: req.user.id, contact_id: cid
    })

    const savedWatchlist = await watchlist.save();

    const query = { "_id": cid }

    try {
      const data = await Contacts.findOne(query).select(['-_id', 'primary_mai_confidence', 'primary_email'])

      res.status(200).json({
        status: 'success',
        data: data
      });
    } catch (error) {
      console.error(error.message);
      res.status(200).send(error.message);
    }

  } catch (error) {
    console.error(error.message);
    res.status(200).send(error.message);
  }
})

router.get('/watchlist', fetchuser, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user.id });
    var query = {
      "_id": { $in: watchlist.map(cid => { return cid.contact_id }) }
    }

    try {
      const wlcontact = new APIfeatures(Contacts.find().select(['_id',
        'first_name',
        'last_name',
        'primary_mai_confidence',
        'primary_email',
        'linkedin_profile',
        'company_name',
        'website',
        'linkedin_link',
        'position',
        'industry',
        'company_size_range',
        'boardline_numbers',
        'person_country',
        'person_city',
        'company_country',
        'company_city',
        'seniority_level',
        'product_services']), query)
        .filtering()
        .paginating();

      const peoples = await wlcontact.query;
      const totalResults = await Contacts.count(query);

      res.status(200).json({
        status: 'success',
        totalResults: totalResults,
        limit: peoples.length,
        // page: req.query.page,
        peoples
      });


    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }

  } catch (error) {
    console.error(error.message);
    res.status(404).send("Not Found");
  }

})

router.delete('/delwatchlist/:id', fetchuser, async (req, res) => {
  try {
    // Find the note to be delete and delete it
    let watchlist = await Watchlist.findById(req.params.id);
    if (!watchlist) { return res.status(404).send("Not Found") }

    // Allow deletion only if user owns this Note
    if (watchlist.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    watchlist = await Watchlist.findByIdAndDelete(req.params.id)
    res.json({ "Success": "People has been removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.delete('/delmulti', fetchuser, async (req, res) => {
  try {
    // Find the note to be delete and delete it
    let watchlist = await Watchlist.findById(req.params.id);
    if (!watchlist) { return res.status(404).send("Not Found") }

    // Allow deletion only if user owns this Note
    if (watchlist.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    watchlist = await Watchlist.findByIdAndDelete(req.params.id)
    res.json({ "Success": "People has been removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})



module.exports = router