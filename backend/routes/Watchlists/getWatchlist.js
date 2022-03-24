const { Fields, RoleFields, APIfeatures } = require("../Classes/clsGlobal");
const Contacts = require("../../models/Contacts");
const Watchlist = require("../../models/Watchlist");

module.exports = async (req, res) => {
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }

  let newLimit = 25;
  if (req.query.limit) {
    newLimit = parseInt(req.query.limit);
  }
  const skip = (page - 1) * newLimit;

  try {
    let watchlist = "";
    if (req.query.from && req.query.to) {
      watchlist = await Watchlist.find({
        user: req.user.id,
        date: { $gte: new Date(req.query.from), $lte: new Date(req.query.to) }
      });
    } else {
      watchlist = await Watchlist.find({ user: req.user.id });
    }

    let search = {};
    search._id = {
      $in: watchlist.map((cid) => {
        return cid.contact_id;
      })
    };

    if (
      req.query.email_confidence_level &&
      req.query.email_confidence_level !== ""
    ) {
      search.email_confidence_level = new Fields(
        req.query.email_confidence_level
      ).create();
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

    if (req.query.first_name && req.query.first_name !== "") {
      search.first_name = new Fields(req.query.first_name).create();
    }

    if (req.query.last_name && req.query.last_name !== "") {
      search.last_name = new Fields(req.query.last_name).create();
    }

    if (req.query.industry && req.query.industry !== "") {
      search["organization.industry"] = new Fields(req.query.industry).create();
    }

    if (req.query.company_name && req.query.company_name !== "") {
      search["organization.organization_name"] = new Fields(
        req.query.company_name
      ).create();
    }

    if (req.query.title && req.query.title !== "") {
      search.title = new Fields(req.query.title).create();
    }

    if (req.query.seniority_level && req.query.seniority_level !== "") {
      search.seniority = new Fields(req.query.seniority_level).create();
    }
    if (req.query.keyword && req.query.keyword !== "") {
      search["organization.keywords"] = new Fields(req.query.keyword).create();
    }
    if (req.query.domain && req.query.domain !== "") {
      search["organization.primary_website_domain"] = new Fields(
        req.query.domain
      ).create();
    }

    if (req.query.company_type && req.query.company_type !== "") {
      search["organization.company_type"] = new Fields(
        req.query.company_type
      ).create();
    }

    if (req.query.company_city && req.query.company_city !== "") {
      search["organization.org_city"] = new Fields(
        req.query.company_city
      ).create();
    }
    if (req.query.company_state && req.query.company_state !== "") {
      search["organization.org_state"] = new Fields(
        req.query.company_state
      ).create();
    }
    if (req.query.company_country && req.query.company_country !== "") {
      search["organization.org_country"] = new Fields(
        req.query.company_country
      ).create();
    }
    if (req.query.city && req.query.city !== "") {
      search.city = new Fields(req.query.city).create();
    }
    if (req.query.state && req.query.state !== "") {
      search.state = new Fields(req.query.state).create();
    }
    if (req.query.country && req.query.country !== "") {
      search.country = new Fields(req.query.country).create();
    }
    if (req.query.department && req.query.department !== "") {
      search.department = new Fields(req.query.department).create();
    }

    if (req.query.company_id && req.query.company_id !== "") {
      search.company_id = new Fields(req.query.company_id).create();
    }

    let RoleObj = [];

    // Role

    if (req.query.role_finance && req.query.role_finance.length !== 0) {
      RoleObj.push(new RoleFields(req.query.role_finance).create());
    }

    if (req.query.role_hr && req.query.role_hr.length !== 0) {
      RoleObj.push(new RoleFields(req.query.role_hr).create());
    }

    if (req.query.role_marketing && req.query.role_marketing.length !== 0) {
      RoleObj.push(new RoleFields(req.query.role_marketing).create());
    }

    if (req.query.role_purchase && req.query.role_purchase.length !== 0) {
      RoleObj.push(new RoleFields(req.query.role_purchase).create());
    }

    if (req.query.role_operation && req.query.role_operation.length !== 0) {
      RoleObj.push(new RoleFields(req.query.role_operation).create());
    }

    if (req.query.role_corporate && req.query.role_corporate.length !== 0) {
      RoleObj.push(new RoleFields(req.query.role_corporate).create());
    }

    if (req.query.role_it && req.query.role_it.length !== 0) {
      RoleObj.push(new RoleFields(req.query.role_it).create());
    }

    if (req.query.role_others && req.query.role_others.length !== 0) {
      RoleObj.push(new RoleFields(req.query.role_others).create());
    }

    // Role

    if (RoleObj) {
      if (RoleObj.length > 0) search.role = new Fields(RoleObj).create();
    }

    if (req.query.company_size_range && req.query.company_size_range !== "") {
      if (req.query.company_size_range instanceof Array) {
        search["organization.size_range"] = {
          $in: req.query.company_size_range
        };
      } else {
        search["organization.size_range"] = req.query.company_size_range;
      }
    }

    if (req.query.revenue_range && req.query.revenue_range !== "") {
      if (req.query.revenue_range instanceof Array) {
        search["organization.annual_revenue"] = {
          $in: req.query.revenue_range
        };
      } else {
        search["organization.annual_revenue"] = req.query.revenue_range;
      }
    }

    try {
      const wlcontact = new APIfeatures(
        Contacts.find().select([
          "_id",
          "company_id",
          "email_confidence_level",
          "email",
          "first_name",
          "last_name",
          "title",
          "country",
          "city",
          "linkedin_id",
          "direct_dial",
          "organization"
        ]),
        search
      )
        .filtering()
        .paginating();

      const peoples = await wlcontact.query;
      const totalResults = await Contacts.count(search);
      const uniqueComp = await Contacts.find(search).distinct("company_id");

      res.status(200).json({
        status: "success",
        totalResults: totalResults,
        totalCompanies: uniqueComp.length,
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
};
