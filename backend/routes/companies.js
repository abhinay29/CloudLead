const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Company = require("../models/Companies");
const Watchlist = require("../models/CompanyWatchlist");
const { body, validationResult } = require("express-validator");
const {
  Fields,
  ConvertStringRegex,
  APIfeatures,
  RoleFields
} = require("./Classes/clsGlobal");
const Filter = require("./Companies/Filter");

// class APIfeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }
//   filtering() {
//     let queryobj = { ...this.queryString };
//     const excludefields = ["page", "sort", "limit"];
//     excludefields.forEach((el) => delete queryobj[el]);

//     let querystr = JSON.stringify(queryobj);
//     querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

//     this.query.find(JSON.parse(querystr));
//     return this;
//   }
//   sorting() {
//     if (this.query.sort) {
//       const sortby = this.queryString.sort.split(",").join(" ");
//       this.query = this.query.sort(sortby);
//     } else {
//       this.query = this.query.sort("-company_name");
//     }
//     return this;
//   }
//   paginating() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 10;
//     let newLimit;
//     if (limit === 25 || limit === 50) {
//       newLimit = limit;
//     } else {
//       newLimit = 25;
//     }
//     const skip = (page - 1) * newLimit;
//     this.query = this.query.skip(skip).limit(newLimit);
//     return this;
//   }

//   // distinct() {
//   //   this.query = this.query.distinct('company_name');
//   //   return this;
//   // }

//   // count() {
//   //   this.query = this.query.count();
//   //   return this;
//   // }
// }

// ROUTE 1: Seach Contacts using: GET "/". Login required
// router.get('/', fetchuser, async (req, res) => {
router.get("/", fetchuser, Filter);

router.get("/byid/:id", async (req, res) => {
  try {
    const comp_data = await Company.findOne({
      company_id: req.params.id
    }).select([
      "_id",
      "company_id",
      "organization_name",
      "website_url",
      "primary_domain",
      "linkedin_url",
      "industry",
      "estimated_employees_headcount",
      "primary_phone_number",
      "country",
      "city",
      "founded_year",
      "company_description",
      "annual_revenue",
      "employee_range"
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
      "annual_revenue",
      "size_range"
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
      organization_name: { $regex: name, $options: "i" }
    }).select(["-_id", "organization_name"]);

    res.status(200).json({
      status: "success",
      companies: company.map((comp) => {
        return { label: comp.organization_name, value: comp.organization_name };
      })
    });
  } catch (error) {
    console.error(error.message);
    res.status(200).json({ status: "error", companies: [] });
  }
});

module.exports = router;
