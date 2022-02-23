const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Company = require("../models/Companies");
const Watchlist = require("../models/CompanyWatchlist");
const { body, validationResult } = require("express-validator");

class ConvertStringRegex {
  constructor(str) {
    this.str = str;
  }

  convertStr() {
    let convertedStr = "";
    for (var x = 0; x < this.str.length; x++) {
      if (x + 1 == this.str.length) {
        convertedStr += this.str[x];
      } else {
        convertedStr += this.str[x] + "|";
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
    const excludefields = ["page", "sort", "limit"];
    excludefields.forEach((el) => delete queryobj[el]);

    let querystr = JSON.stringify(queryobj);
    querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(querystr));
    return this;
  }
  sorting() {
    if (this.query.sort) {
      const sortby = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort("-company_name");
    }
    return this;
  }
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

// ROUTE 1: Seach Contacts using: GET "/". Login required
// router.get('/', fetchuser, async (req, res) => {
router.get("/", fetchuser, async (req, res) => {
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

  if (req.query.industry && req.query.industry !== "") {
    if (req.query.industry instanceof Array) {
      if (req.query.industry.length == 1) {
        newQuery.industry = { $regex: req.query.industry[0], $options: "i" };
      } else {
        let regexIndustries = new ConvertStringRegex(
          req.query.industry
        ).convertStr();
        newQuery.industry = { $regex: regexIndustries, $options: "i" };
      }
    } else {
      newQuery.industry = { $regex: req.query.industry, $options: "i" };
    }
  }
  if (req.query.company_name && req.query.company_name !== "") {
    if (req.query.company_name instanceof Array) {
      if (req.query.company_name.length == 1) {
        newQuery.organization_name = {
          $regex: req.query.company_name[0],
          $options: "i"
        };
      } else {
        let regexCompName = new ConvertStringRegex(
          req.query.company_name
        ).convertStr();
        newQuery.organization_name = { $regex: regexCompName, $options: "i" };
      }
    } else {
      newQuery.organization_name = {
        $regex: req.query.company_name,
        $options: "i"
      };
    }
  }
  if (req.query.company_size_range && req.query.company_size_range !== "") {
    if (req.query.company_size_range instanceof Array) {
      let regexCompSize = new ConvertStringRegex(
        req.query.company_size_range
      ).convertStr();
      newQuery.company_size_range = { $regex: regexCompSize, $options: "i" };
    } else {
      newQuery.company_size_range = {
        $regex: req.query.company_size_range,
        $options: "i"
      };
    }
  }
  if (req.query.company_type && req.query.company_type !== "") {
    if (req.query.company_type instanceof Array) {
      let regexCompType = new ConvertStringRegex(
        req.query.company_type
      ).convertStr();
      newQuery.organization_type = { $regex: regexCompType, $options: "i" };
    } else {
      newQuery.organization_type = {
        $regex: req.query.company_type,
        $options: "i"
      };
    }
  }

  if (req.query.keyword && req.query.keyword !== "") {
    if (req.query.keyword instanceof Array) {
      let regexKeyword = new ConvertStringRegex(req.query.keyword).convertStr();
      newQuery.keywords = { $regex: regexKeyword, $options: "i" };
    } else {
      newQuery.keywords = { $regex: req.query.keyword, $options: "i" };
    }
  }
  if (req.query.domain && req.query.domain !== "") {
    if (req.query.domain instanceof Array) {
      let regexDomain = new ConvertStringRegex(req.query.domain).convertStr();
      newQuery.primary_website_domain = { $regex: regexDomain, $options: "i" };
    } else {
      newQuery.primary_website_domain = {
        $regex: req.query.domain,
        $options: "i"
      };
    }
  }
  if (req.query.company_city && req.query.company_city !== "") {
    if (req.query.company_city instanceof Array) {
      let regexCompCity = new ConvertStringRegex(
        req.query.company_city
      ).convertStr();
      newQuery.org_city = { $regex: regexCompCity, $options: "i" };
    } else {
      newQuery.org_city = { $regex: req.query.company_city, $options: "i" };
    }
  }
  if (req.query.company_state && req.query.company_state !== "") {
    if (req.query.company_state instanceof Array) {
      let regexCompState = new ConvertStringRegex(
        req.query.company_state
      ).convertStr();
      newQuery.org_state = { $regex: regexCompState, $options: "i" };
    } else {
      newQuery.org_state = {
        $regex: req.query.company_state,
        $options: "i"
      };
    }
  }
  if (req.query.company_country && req.query.company_country !== "") {
    if (req.query.company_country instanceof Array) {
      let regexCompCountry = new ConvertStringRegex(
        req.query.company_country
      ).convertStr();
      newQuery.org_country = { $regex: regexCompCountry, $options: "i" };
    } else {
      newQuery.org_country = {
        $regex: req.query.company_country,
        $options: "i"
      };
    }
  }

  if (req.query.revenue_range && req.query.revenue_range !== "") {
    if (req.query.revenue_range instanceof Array) {
      let regexRevenueRange = new ConvertStringRegex(
        req.query.revenue_range
      ).convertStr();
      newQuery.annual_revenue = { $regex: regexRevenueRange, $options: "i" };
    } else {
      newQuery.annual_revenue = {
        $regex: req.query.revenue_range,
        $options: "i"
      };
    }
  }

  newQuery.sort = "organization_name";

  console.log(newQuery);

  try {
    const features = new APIfeatures(
      Company.find().select([
        "_id",
        "company_id",
        "organization_name",
        "website_link",
        "org_linkedin_url",
        "industry",
        "estimated_employees_headcount",
        "primary_phone",
        "org_country",
        "org_city"
      ]),
      newQuery
    )
      .filtering()
      .sorting()
      .paginating();
    const companies = await features.query;
    const totalResults = await Company.count(newQuery);
    const uniqueComp = await Company.find(newQuery).distinct(
      "primary_website_domain"
    );
    res.status(200).json({
      status: "success",
      total: uniqueComp.length,
      totalResults: totalResults,
      limit: companies.length,
      page: req.query.page,
      data: {
        companies
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/byid/:id", async (req, res) => {
  try {
    const comp_data = await Company.findOne({
      company_id: req.params.id
    }).select([
      "_id",
      "company_id",
      "company_name",
      "website",
      "domain",
      "linkedin_link",
      "industry",
      "company_size_range",
      "boardline_numbers",
      "company_country",
      "company_city",
      "founded",
      "description",
      "revenue_range"
    ]);
    res.status(200).json({
      status: "success",
      comp_data
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).send("Company not found");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const comp_data = await Company.findOne({
      company_id: req.params.id
    }).select([
      "_id",
      "company_id",
      "organization_name",
      "website_link",
      "primary_website_domain",
      "org_linkedin_url",
      "industry",
      "estimated_employees_headcount",
      "primary_phone",
      "org_country",
      "org_city",
      "founded_year",
      "company_description",
      "annual_revenue"
    ]);
    res.status(200).json({
      status: "success",
      comp_data
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).send("Company not found");
  }
});

router.post("/addtowatchlist", fetchuser, async (req, res) => {
  try {
    const { cid } = req.body;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const watchlist = new Watchlist({
      user: req.user.id,
      contact_id: cid
    });

    const savedWatchlist = await watchlist.save();

    res.status(200).json({
      status: "success"
    });
  } catch (error) {
    console.error(error.message);
    res.status(200).send(error.message);
  }
});

router.get("/w/watchlist", fetchuser, async (req, res) => {
  let query = {};
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }

  let newLimit = 50;
  if (req.query.limit) {
    newLimit = parseInt(req.query.limit);
  }
  const skip = (page - 1) * newLimit;

  try {
    // const watchlist = await Watchlist.find({ user: req.user.id }).skip(skip).limit(newLimit);
    const watchlist = await Watchlist.find({ user: req.user.id });

    let search = {};
    search._id = {
      $in: watchlist.map((cid) => {
        return cid.contact_id;
      })
    };
    search.page = page;

    try {
      const wlcompany = new APIfeatures(
        Company.find().select([
          "_id",
          "organization_name",
          "website_link",
          "org_linkedin_url",
          "industry",
          "primary_phone",
          "org_country",
          "org_city",
          "estimated_employees_headcount"
        ]),
        search
      )
        .filtering()
        .paginating();

      const companies = await wlcompany.query;
      const totalResults = await Company.count(search);

      res.status(200).json({
        status: "success",
        totalResults: totalResults,
        limit: companies.length ? companies.length : 0,
        page: req.query.page,
        companies
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error(error.message);
    res.status(404).send("Not Found");
  }
});

router.get("/suggestions/:name", async (req, res) => {
  let name;
  if (req.params.name) {
    name = req.params.name;
  }

  try {
    const company = await Company.find({
      company_name: { $regex: name, $options: "i" }
    }).select(["-_id", "company_name"]);

    res.status(200).json({
      status: "success",
      companies: company.map((comp) => {
        return { label: comp.company_name, value: comp.company_name };
      })
    });
  } catch (error) {
    console.error(error.message);
    res.status(200).json({ status: "error", companies: [] });
  }
});

module.exports = router;
