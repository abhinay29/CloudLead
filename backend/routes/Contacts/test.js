const { Fields } = require("../Classes/clsGlobal");
const Contacts = require("../../models/Contacts");

module.exports = async (req, res) => {
  let newQuery = {};

  if (req.query.company_name && req.query.company_name !== "") {
    newQuery["organization.organization_name"] = new Fields(
      req.query.company_name
    ).create();
  }

  console.log(newQuery);

  const findContactQuery = await Contacts.find(newQuery)
    .select([
      "_id",
      "company_id",
      "first_name",
      "last_name",
      "title",
      "country",
      "city",
      "organization"
    ])
    .limit(10);

  const totalContacts = await Contacts.count(newQuery);

  res.status(200).json({
    total: totalContacts,
    data: findContactQuery
  });
};
