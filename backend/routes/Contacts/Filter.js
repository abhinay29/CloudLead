const { Fields, RoleFields, APIfeatures } = require("../Classes/clsGlobal");
const Contacts = require("../../models/Contacts");
const Watchlist = require("../../models/Watchlist");

module.exports = async (req, res) => {
  var start = new Date();

  if (
    req.query.first_name ||
    req.query.last_name ||
    req.query.company_name ||
    req.query.title ||
    req.query.industry ||
    req.query.company_size_range ||
    req.query.department ||
    req.query.role ||
    req.query.country ||
    req.query.state ||
    req.query.city ||
    req.query.company_country ||
    req.query.company_state ||
    req.query.company_city ||
    req.query.seniority_level ||
    req.query.company_type ||
    req.query.keyword ||
    req.query.domain ||
    req.query.revenue_range ||
    req.query.company_id
  ) {
    // Nothing happen here jump to try {} catch {}
  } else {
    return res.status(200).json({
      status: "error",
      msg: "Invalid query string"
    });
  }

  if (req.query.first_name === "." || req.query.last_name === ".") {
    return res.status(200).json({
      status: "error",
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

  if (req.query.first_name && req.query.first_name !== "") {
    newQuery.first_name = new Fields(req.query.first_name).create();
  }

  if (req.query.last_name && req.query.last_name !== "") {
    newQuery.last_name = new Fields(req.query.last_name).create();
  }

  if (req.query.industry && req.query.industry !== "") {
    newQuery["organization.industry"] = new Fields(req.query.industry).create();
  }

  if (req.query.company_name && req.query.company_name !== "") {
    newQuery["organization.organization_name"] = new Fields(
      req.query.company_name
    ).create();
  }

  if (req.query.title && req.query.title !== "") {
    newQuery.title = new Fields(req.query.title).create();
  }

  if (req.query.company_type && req.query.company_type !== "") {
    newQuery["organization.company_type"] = new Fields(
      req.query.company_type
    ).create();
  }
  if (req.query.seniority_level && req.query.seniority_level !== "") {
    newQuery.seniority = new Fields(req.query.seniority_level).create();
  }
  if (req.query.keyword && req.query.keyword !== "") {
    newQuery["organization.keywords"] = new Fields(req.query.keyword).create();
  }
  if (req.query.domain && req.query.domain !== "") {
    newQuery["organization.primary_website_domain"] = new Fields(
      req.query.domain
    ).create();
  }
  if (req.query.company_city && req.query.company_city !== "") {
    newQuery["organization.org_city"] = new Fields(
      req.query.company_city
    ).create();
  }
  if (req.query.company_state && req.query.company_state !== "") {
    newQuery["organization.org_state"] = new Fields(
      req.query.company_state
    ).create();
  }
  if (req.query.company_country && req.query.company_country !== "") {
    newQuery["organization.org_country"] = new Fields(
      req.query.company_country
    ).create();
  }
  if (req.query.city && req.query.city !== "") {
    newQuery.city = new Fields(req.query.city).create();
  }
  if (req.query.state && req.query.state !== "") {
    newQuery.state = new Fields(req.query.state).create();
  }
  if (req.query.country && req.query.country !== "") {
    newQuery.country = new Fields(req.query.country).create();
  }
  if (req.query.department && req.query.department !== "") {
    newQuery.department = new Fields(req.query.department).create();
  }

  if (req.query.company_id && req.query.company_id !== "") {
    newQuery.company_id = new Fields(req.query.company_id).create();
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
    if (RoleObj.length > 0) newQuery.role = new Fields(RoleObj).create();
  }

  // if (req.query.company_size_range && req.query.company_size_range !== "") {
  //   newQuery["organization.size_range"] = new Fields(
  //     req.query.company_size_range
  //   ).create();
  // }

  if (req.query.company_size_range && req.query.company_size_range !== "") {
    if (req.query.company_size_range instanceof Array) {
      newQuery["organization.size_range"] = {
        $in: req.query.company_size_range
      };
    } else {
      newQuery["organization.size_range"] = req.query.company_size_range;
    }
  }

  if (req.query.revenue_range && req.query.revenue_range !== "") {
    if (req.query.revenue_range instanceof Array) {
      newQuery["organization.annual_revenue"] = {
        $in: req.query.revenue_range
      };
    } else {
      newQuery["organization.annual_revenue"] = req.query.revenue_range;
    }
  }

  newQuery.sort = "first_name, last_name";

  console.log(newQuery);

  var end = new Date() - start;
  console.log("Time taken - query processing : ", end);

  try {
    const features = new APIfeatures(
      Contacts.find()
        .select([
          "_id",
          "company_id",
          "first_name",
          "last_name",
          "title",
          "country",
          "city",
          "linkedin_id",
          "direct_dial",
          "organization"
        ])
        .allowDiskUse(),
      newQuery
    )
      .filtering()
      .sorting()
      .paginating();

    const contacts = await features.query;
    var end = new Date() - start;
    console.log("Time taken - find query run: ", end);
    // const totalContacts = await Contacts.count({});
    // const totalResults = await Contacts.count(newQuery);

    // var end = new Date() - start;
    // console.log("Time taken - totalResults count: ", end);

    // const uniqueComp = await Contacts.find(newQuery).distinct("company_id");
    // var end = new Date() - start;
    // console.log("Time taken - distinct: ", end);
    // newQuery.direct_dial = "available";
    // const directDial = await Contacts.count(newQuery);
    // // let reqLimit = 50;
    // // if (req.query.limit) {
    // //   reqLimit = parseInt(req.query.limit);
    // // }

    // var end = new Date() - start;
    // console.log("Time taken - directDial Count: ", end);

    // const totalResults = 20000;
    // const uniqueComp = 0;
    // const directDial = 0;

    async function getEmail(cid) {
      let checkWatchlist = await Watchlist.findOne({
        user: req.user.id,
        contact_id: cid
      });
      if (checkWatchlist) {
        return "yes";
      } else {
        return "no";
      }
    }

    // async function getCompany(comp_id) {
    //   let company = await Company.findOne({
    //     company_id: comp_id
    //   });
    //   return company;
    // }

    const Conts = [];
    const checkUnlock = contacts.map(async (contact) => {
      var temp = JSON.parse(JSON.stringify(contact));
      temp.unlocked_email = await getEmail(contact._id);
      // temp.company = await getCompany(contact.company_id);
      // if (!contact.organization.organization_name) {
      //   contact.organization.organization_name = " ";
      // }
      Conts.push(temp);
    });

    await Promise.all(checkUnlock);

    var end = new Date() - start;
    console.log("Time taken - checkUnlock : ", end);

    // console.log(Conts);

    res.status(200).json({
      status: "success",
      // total: totalContacts,
      // totalResults: totalResults,
      // directDial: directDial,
      // uniqueCompany: uniqueComp.length,
      limit: contacts.length,
      page: req.query.page ? parseInt(req.query.page) : 1,
      data: {
        contacts: Conts
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
