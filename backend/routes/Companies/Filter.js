const { Fields, RoleFields, APIfeatures } = require("../Classes/clsGlobal");
// const Watchlist = require("../../models/Watchlist");
const Company = require("../../models/Companies");
// const Watchlist = require("../../models/CompanyWatchlist");

module.exports = async (req, res) => {
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
    newQuery.industry = new Fields(req.query.industry).create();
  }

  if (req.query.company_name && req.query.company_name !== "") {
    newQuery.organization_name = new Fields(req.query.company_name).create();
  }

  if (req.query.company_size_range && req.query.company_size_range !== "") {
    if (req.query.company_size_range instanceof Array) {
      let regexCompSize = new ConvertStringRegex(
        req.query.company_size_range
      ).convertStr();
      newQuery.employee_range = { $regex: regexCompSize, $options: "i" };
    } else {
      newQuery.employee_range = {
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
      newQuery.company_type = { $regex: regexCompType, $options: "i" };
    } else {
      newQuery.company_type = {
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
      newQuery.city = { $regex: regexCompCity, $options: "i" };
    } else {
      newQuery.city = { $regex: req.query.company_city, $options: "i" };
    }
  }
  if (req.query.company_state && req.query.company_state !== "") {
    if (req.query.company_state instanceof Array) {
      let regexCompState = new ConvertStringRegex(
        req.query.company_state
      ).convertStr();
      newQuery.state = { $regex: regexCompState, $options: "i" };
    } else {
      newQuery.state = {
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
      newQuery.country = { $regex: regexCompCountry, $options: "i" };
    } else {
      newQuery.country = {
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
      newQuery.revenue = { $regex: regexRevenueRange, $options: "i" };
    } else {
      newQuery.revenue = {
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
        "industry",
        "city",
        "country",
        "org_linkedin_url",
        "organization_name",
        "primary_phone_number",
        "size_range",
        "website_link"
      ]),
      newQuery
    )
      .filtering()
      .sorting()
      .paginating();
    const companies = await features.query;
    const totalResults = await Company.count(newQuery);
    // const uniqueComp = await Company.find(newQuery).distinct(
    //   "primary_website_domain"
    // );
    res.status(200).json({
      status: "success",
      // total: uniqueComp.length,
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
};
