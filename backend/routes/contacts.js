const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Contacts = require('../models/Contacts');
const Watchlist = require('../models/Watchlist');
const useExport = require('../models/Export');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Plans = require('../models/Plans');

const rand = () => Math.random(0).toString(36).substr(2);
const getToken = (length = 32) => (rand() + rand() + rand() + rand()).substr(0, length);

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
    if (limit === 25 || limit === 50) {
      newLimit = limit;
    } else {
      newLimit = 25;
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


router.get('/', fetchuser, async (req, res) => {

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

  if (
    req.query.first_name === "." ||
    req.query.last_name === '.'
  ) {
    return res.status(200).json({
      status: 'error',
      msg: "Invalid query string"
    });
  }


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

  let RoleObj = [];

  // Role

  if (req.query.role_finance && req.query.role_finance.length !== 0) {
    if (req.query.role_finance instanceof Array) {
      req.query.role_finance.map(fin => {
        RoleObj.push(fin)
      })
    } else {
      RoleObj.push(req.query.role_finance);
    }
  }
  if (req.query.role_hr && req.query.role_hr.length !== 0) {
    if (req.query.role_hr instanceof Array) {
      req.query.role_hr.map(hr => {
        RoleObj.push(hr)
      })
    } else {
      RoleObj.push(req.query.role_hr);
    }
  }

  if (req.query.role_marketing && req.query.role_marketing.length !== 0) {
    if (req.query.role_marketing instanceof Array) {
      req.query.role_marketing.map(marketing => {
        RoleObj.push(marketing)
      })
    } else {
      RoleObj.push(req.query.role_marketing);
    }
  }

  if (req.query.role_purchase && req.query.role_purchase.length !== 0) {
    if (req.query.role_purchase instanceof Array) {
      req.query.role_purchase.map(purchase => {
        RoleObj.push(purchase)
      })
    } else {
      RoleObj.push(req.query.role_purchase);
    }
  }

  if (req.query.role_operation && req.query.role_operation.length !== 0) {
    if (req.query.role_operation instanceof Array) {
      req.query.role_operation.map(operation => {
        RoleObj.push(operation)
      })
    } else {
      RoleObj.push(req.query.role_operation);
    }
  }

  if (req.query.role_corporate && req.query.role_corporate.length !== 0) {
    if (req.query.role_corporate instanceof Array) {
      req.query.role_corporate.map(corporate => {
        RoleObj.push(corporate)
      })
    } else {
      RoleObj.push(req.query.role_corporate);
    }
  }

  if (req.query.role_it && req.query.role_it.length !== 0) {
    if (req.query.role_it instanceof Array) {
      req.query.role_it.map(it => {
        RoleObj.push(it)
      })
    } else {
      RoleObj.push(req.query.role_it);
    }
  }

  if (req.query.role_others && req.query.role_others.length !== 0) {
    if (req.query.role_others instanceof Array) {
      req.query.role_others.map(others => {
        RoleObj.push(others)
      })
    } else {
      RoleObj.push(req.query.role_others);
    }
  }

  // Role

  if (RoleObj) {
    if (RoleObj instanceof Array) {
      regexRole = new ConvertStringRegex(RoleObj).convertStr();
      newQuery.role = { $regex: regexRole, $options: 'i' }
    } else {
      newQuery.role = { $regex: RoleObj, $options: 'i' }
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

  // console.log(newQuery)

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


    async function getEmail(cid) {
      let checkWatchlist = await Watchlist.findOne({ user: req.user.id, contact_id: cid });
      if (checkWatchlist) {
        return 'yes';
      } else {
        return 'no';
      }
    }

    const Conts = [];
    const checkUnlock = contacts.map(async contact => {
      var temp = JSON.parse(JSON.stringify(contact));
      // let unlocked_email = getEmail(contact._id);
      // temp.unlocked_email = unlocked_email.then(function (result) {
      //   return result;
      // })
      temp.unlocked_email = await getEmail(contact._id);
      Conts.push(temp);
    })

    await Promise.all(checkUnlock)

    res.status(200).json({
      status: 'success',
      // total: totalContacts,
      totalResults: totalResults,
      limit: contacts.length,
      page: req.query.page,
      uniqueCompany: uniqueComp.length,
      data: {
        contacts: Conts
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

    const userData = await User.findOne({ _id: req.user.id })

    if (!userData) {
      res.status(401).json({
        status: 'error',
        error: 'Unauthorised access'
      });
    }

    const Plan = await Plans.findOne({ plan_id: userData.plan_id })

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let checkWatchlist = await Watchlist.findOne({ user: req.user.id, contact_id: cid });

    if (checkWatchlist !== null) {
      res.status(200).json({
        status: 'exist',
        msg: 'Contact is already in your watchlist'
      });
      return false;
    }

    let checkWatchlistCount = await Watchlist.count({ user: req.user.id });

    if (Plan.unlock_daily < checkWatchlistCount) {
      res.status(200).json({
        status: 'limit_reached',
        msg: 'Your daily unlock limit is reached, upgrade your plan or visit again tomorrow'
      });
      return false;
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

router.post('/unlockbulk', fetchuser, async (req, res) => {

  // if (!req.body.ids) {
  //   res.status(200).json({
  //     status: 'error',
  //     error: 'Invalid query'
  //   });
  // }

  const userData = await User.findOne({ _id: req.user.id })

  if (!userData) {
    res.status(401).json({
      status: 'error',
      error: 'Unauthorised access'
    });
  }

  const Plan = await Plans.findOne({ plan_id: userData.plan_id })

  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      res.status(200).json({
        status: 'error',
        message: 'Invalid access of blank data'
      })
    }

    let checkWatchlistCount = await Watchlist.count({ user: req.user.id });

    if (Plan.unlock_daily > checkWatchlistCount) {
      if (ids.length > Plan.unlock_daily) {
        res.status(200).json({
          status: 'limit_reached',
          msg: `You can only get contact '${Plan.unlock_daily}' in a day`
        });
        return false;
      }
    } else {
      res.status(200).json({
        status: 'limit_reached',
        msg: 'Your daily unlock limit is reached, upgrade your plan or visit again tomorrow'
      });
      return false;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let watchlist;
    let count = 0
    let check;
    for (var x = 0; x < ids.length; x++) {
      check = await Watchlist.findOne({ user: req.user.id, contact_id: ids[x] });
      if (!check) {
        watchlist = await Watchlist.create({ user: req.user.id, contact_id: ids[x] });
        if (watchlist) {
          count++;
        }
      }
    }

    const query = { "_id": { $in: ids } }

    try {
      const data = await Contacts.find(query).select(['primary_mai_confidence', 'primary_email'])
      res.status(200).json({
        status: 'success',
        data: data,
        unlocked: count
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

  let query = {}
  let page = 1
  if (req.query.page) {
    page = parseInt(req.query.page)
  }

  let newLimit = 50;
  if (req.query.limit) {
    newLimit = parseInt(req.query.limit)
  }
  const skip = (page - 1) * newLimit;

  try {
    // const watchlist = await Watchlist.find({ user: req.user.id }).skip(skip).limit(newLimit);

    let watchlist = ''

    if (req.query.from && req.query.to) {
      watchlist = await Watchlist.find({ user: req.user.id, date: { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } });
    } else {
      watchlist = await Watchlist.find({ user: req.user.id });
    }

    // console.log(req.query)

    let search = {}
    search._id = { $in: watchlist.map(cid => { return cid.contact_id }) }

    if (req.query.primary_mai_confidence && req.query.primary_mai_confidence !== '') {
      if (req.query.primary_mai_confidence instanceof Array) {
        if (req.query.primary_mai_confidence.length > 0) {
          let regexConfidence = new ConvertStringRegex(req.query.primary_mai_confidence).convertStr();
          search.primary_mai_confidence = { $regex: regexConfidence, $options: 'i' }
        }
      } else {
        search.primary_mai_confidence = { $regex: req.query.primary_mai_confidence, $options: 'i' }
      }
    }

    if (req.query.page) {
      search.page = req.query.page;
    }
    if (req.query.sort) {
      search.sort = req.query.sort;
    }
    if (req.query.limit) {
      search.limit = req.query.limit;
    }

    if (req.query.first_name && req.query.first_name !== '') {
      if (req.query.first_name instanceof Array) {
        if (req.query.first_name.length > 0) {
          //   // search.first_name = { $regex: req.query.first_name[0], $options: 'i' }
          // } else {
          let regexFirstName = new ConvertStringRegex(req.query.first_name).convertStr();
          search.first_name = { $regex: regexFirstName, $options: 'i' }
        }
      } else {
        search.first_name = { $regex: req.query.first_name, $options: 'i' }
      }
    }

    if (req.query.last_name && req.query.last_name !== '') {
      if (req.query.last_name instanceof Array) {
        if (req.query.last_name.length > 0) {
          //   search.last_name = { $regex: req.query.last_name[0], $options: 'i' }
          // } else {
          let regexLastName = new ConvertStringRegex(req.query.last_name).convertStr();
          search.last_name = { $regex: regexLastName, $options: 'i' }
        }
      } else {
        search.last_name = { $regex: req.query.last_name, $options: 'i' }
      }
    }
    if (req.query.industry && req.query.industry !== '') {
      if (req.query.industry instanceof Array) {
        if (req.query.industry.length == 0) {
          search.industry = { $regex: req.query.industry[0], $options: 'i' }
        } else {
          let regexIndustries = new ConvertStringRegex(req.query.industry).convertStr();
          search.industry = { $regex: regexIndustries, $options: 'i' }
        }
      } else {
        search.industry = { $regex: req.query.industry, $options: 'i' }
      }
    }
    if (req.query.company_name && req.query.company_name !== '') {
      if (req.query.company_name instanceof Array) {
        if (req.query.company_name.length > 0) {
          //   search.company_name = { $regex: req.query.company_name[0], $options: 'i' }
          // } else {
          let regexCompName = new ConvertStringRegex(req.query.company_name).convertStr();
          search.company_name = { $regex: regexCompName, $options: 'i' }
        }
      } else {
        search.company_name = { $regex: req.query.company_name, $options: 'i' }
      }
    }
    if (req.query.position && req.query.position !== '') {
      if (req.query.position instanceof Array) {
        if (req.query.position.length == 1) {
          search.position = { $regex: req.query.position[0], $options: 'i' }
        } else {
          let regexPosition = new ConvertStringRegex(req.query.position).convertStr();
          search.position = { $regex: regexPosition, $options: 'i' }
        }
      } else {
        search.position = { $regex: req.query.position, $options: 'i' }
      }
    }
    if (req.query.company_size_range && req.query.company_size_range !== '') {
      if (req.query.company_size_range instanceof Array) {
        let regexCompSize = new ConvertStringRegex(req.query.company_size_range).convertStr();
        search.company_size_range = { $regex: regexCompSize, $options: 'i' }
      } else {
        search.company_size_range = { $regex: req.query.company_size_range, $options: 'i' }
      }
    }
    if (req.query.company_type && req.query.company_type !== '') {
      if (req.query.company_type instanceof Array) {
        let regexCompType = new ConvertStringRegex(req.query.company_type).convertStr();
        search.company_type = { $regex: regexCompType, $options: 'i' }
      } else {
        search.company_type = { $regex: req.query.company_type, $options: 'i' }
      }
    }
    if (req.query.seniority_level && req.query.seniority_level !== '') {
      if (req.query.seniority_level instanceof Array) {
        let regexSrLevel = new ConvertStringRegex(req.query.seniority_level).convertStr();
        search.seniority_level = { $regex: regexSrLevel, $options: 'i' }
      } else {
        search.seniority_level = { $regex: req.query.seniority_level, $options: 'i' }
      }
    }
    if (req.query.keyword && req.query.keyword !== '') {
      if (req.query.keyword instanceof Array) {
        let regexKeyword = new ConvertStringRegex(req.query.keyword).convertStr();
        search.keyword = { $regex: regexKeyword, $options: 'i' }
      } else {
        search.keyword = { $regex: req.query.keyword, $options: 'i' }
      }
    }
    if (req.query.domain && req.query.domain !== '') {
      if (req.query.domain instanceof Array) {
        let regexDomain = new ConvertStringRegex(req.query.domain).convertStr();
        search.domain = { $regex: regexDomain, $options: 'i' }
      } else {
        search.domain = { $regex: req.query.domain, $options: 'i' }
      }
    }
    if (req.query.company_city && req.query.company_city !== '') {
      if (req.query.company_city instanceof Array) {
        let regexCompCity = new ConvertStringRegex(req.query.company_city).convertStr();
        search.company_city = { $regex: regexCompCity, $options: 'i' }
      } else {
        search.company_city = { $regex: req.query.company_city, $options: 'i' }
      }
    }
    if (req.query.company_state && req.query.company_state !== '') {
      if (req.query.company_state instanceof Array) {
        let regexCompState = new ConvertStringRegex(req.query.company_state).convertStr();
        search.company_state = { $regex: regexCompState, $options: 'i' }
      } else {
        search.company_state = { $regex: req.query.company_state, $options: 'i' }
      }
    }
    if (req.query.company_country && req.query.company_country !== '') {
      if (req.query.company_country instanceof Array) {
        let regexCompCountry = new ConvertStringRegex(req.query.company_country).convertStr();
        search.company_country = { $regex: regexCompCountry, $options: 'i' }
      } else {
        search.company_country = { $regex: req.query.company_country, $options: 'i' }
      }
    }
    if (req.query.person_city && req.query.person_city !== '') {
      if (req.query.person_city instanceof Array) {
        let regexPersCity = new ConvertStringRegex(req.query.person_city).convertStr();
        search.person_city = { $regex: regexPersCity, $options: 'i' }
      } else {
        search.person_city = { $regex: req.query.person_city, $options: 'i' }
      }
    }
    if (req.query.person_state && req.query.person_state !== '') {
      if (req.query.person_state instanceof Array) {
        let regexPersState = new ConvertStringRegex(req.query.person_state).convertStr();
        search.person_state = { $regex: regexPersState, $options: 'i' }
      } else {
        search.person_state = { $regex: req.query.person_state, $options: 'i' }
      }
    }
    if (req.query.person_country && req.query.person_country !== '') {
      if (req.query.person_country instanceof Array) {
        let regexPersCountry = new ConvertStringRegex(req.query.person_country).convertStr();
        search.person_country = { $regex: regexPersCountry, $options: 'i' }
      } else {
        search.person_country = { $regex: req.query.person_country, $options: 'i' }
      }
    }
    if (req.query.department && req.query.department !== '') {
      if (req.query.department instanceof Array) {
        let regexDepart = new ConvertStringRegex(req.query.department).convertStr();
        search.department = { $regex: regexDepart, $options: 'i' }
      } else {
        search.department = { $regex: req.query.department, $options: 'i' }
      }
    }

    let RoleObj = [];

    // Role

    if (req.query.role_finance && req.query.role_finance.length !== 0) {
      if (RoleObj instanceof Array) {
        req.query.role_finance.map(fin => {
          RoleObj.push(fin)
        })
      } else {
        RoleObj.push(req.query.role_finance);
      }
    }
    if (req.query.role_hr && req.query.role_hr.length !== 0) {
      if (RoleObj instanceof Array) {
        req.query.role_hr.map(hr => {
          RoleObj.push(hr)
        })
      } else {
        RoleObj.push(req.query.role_hr);
      }
    }

    if (req.query.role_marketing && req.query.role_marketing.length !== 0) {
      if (RoleObj instanceof Array) {
        req.query.role_marketing.map(marketing => {
          RoleObj.push(marketing)
        })
      } else {
        RoleObj.push(req.query.role_marketing);
      }
    }

    if (req.query.role_purchase && req.query.role_purchase.length !== 0) {
      if (RoleObj instanceof Array) {
        req.query.role_purchase.map(purchase => {
          RoleObj.push(purchase)
        })
      } else {
        RoleObj.push(req.query.role_purchase);
      }
    }

    if (req.query.role_operation && req.query.role_operation.length !== 0) {
      if (RoleObj instanceof Array) {
        req.query.role_operation.map(operation => {
          RoleObj.push(operation)
        })
      } else {
        RoleObj.push(req.query.role_operation);
      }
    }

    if (req.query.role_corporate && req.query.role_corporate.length !== 0) {
      if (RoleObj instanceof Array) {
        req.query.role_corporate.map(corporate => {
          RoleObj.push(corporate)
        })
      } else {
        RoleObj.push(req.query.role_corporate);
      }
    }

    if (req.query.role_it && req.query.role_it.length !== 0) {
      if (RoleObj instanceof Array) {
        req.query.role_it.map(it => {
          RoleObj.push(it)
        })
      } else {
        RoleObj.push(req.query.role_it);
      }
    }

    if (req.query.role_others && req.query.role_others.length !== 0) {
      if (RoleObj instanceof Array) {
        req.query.role_others.map(others => {
          RoleObj.push(others)
        })
      } else {
        RoleObj.push(req.query.role_others);
      }
    }

    // Role

    if (RoleObj) {
      if (RoleObj instanceof Array) {
        regexRole = new ConvertStringRegex(RoleObj).convertStr();
        search.role = { $regex: regexRole, $options: 'i' }
      } else {
        search.role = { $regex: RoleObj, $options: 'i' }
      }
    }

    if (req.query.product_services && req.query.product_services !== '') {
      if (req.query.product_services instanceof Array) {
        let regexServices = new ConvertStringRegex(req.query.product_services).convertStr();
        search.product_services = { $regex: regexServices, $options: 'i' }
      } else {
        search.product_services = { $regex: req.query.product_services, $options: 'i' }
      }
    }
    if (req.query.revenue_range && req.query.revenue_range !== '') {
      if (req.query.revenue_range instanceof Array) {
        // let regexRevenueRange = new ConvertStringRegex(req.query.revenue_range).convertStr();
        search.revenue_range = { $in: req.query.revenue_range }
      } else {
        search.revenue_range = req.query.revenue_range
      }
    }

    // console.log(search)

    // search.page = page;


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
        'product_services']), search)
        .filtering()
        .paginating();

      const peoples = await wlcontact.query;
      const totalResults = await Contacts.count(search);

      res.status(200).json({
        status: 'success',
        totalResults: totalResults,
        limit: peoples.length ? peoples.length : 0,
        page: req.query.page,
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

router.post('/watchlist/export', fetchuser, require('./Contacts/export'));
router.get('/watchlist/download', require('./Contacts/downloadcsv'));

router.delete('/deletewatchlist', fetchuser, async (req, res) => {

  if (req.body.ids.length === 0) {
    return res.status(404).json({ status: "error", msg: "Please select people to remove from watchlist" })
  }

  try {

    let watchlist = await Watchlist.find({ user: req.user.id });
    if (!watchlist) { return res.status(404).json({ status: "error", msg: "Not Found" }) }

    // if (watchlist.contact.toString() !== req.user.id) {
    //   return res.status(401).json({ status: "error", msg: "Not Found" });
    // }
    watchlist = await Watchlist.deleteMany({ user: req.user.id, contact_id: { $in: req.body.ids.map(cid => { return cid }) } })
    res.status(200).json({
      status: "success",
      deletedCount: watchlist.deletedCount
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router