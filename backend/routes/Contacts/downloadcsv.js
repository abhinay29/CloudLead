require("dotenv").config();
const userExport = require("../../models/Export");
const Contacts = require("../../models/Contacts");

module.exports = async (req, res) => {
  const data = await userExport.findOne({ token: req.query.token });
  const idArray = await data.contactIds;

  const getContactData = async (id) => {
    try {
      let data = await Contacts.findOne({ _id: id }).select([
        "-_id",
        "first_name",
        "last_name",
        "title",
        "email",
        "organization.organization_name",
        "linkedin_id",
        "city",
        "state",
        "country",
        "seniority",
        "role",
        "department",
        "organization.company_type",
        "organization.industry",
        "organization.size_range",
        "organization.org_country",
        "organization.org_city",
        "organization.website_link"
      ]);
      return data;
    } catch (err) {
      console.log("TryCatchError: ", err);
      return false;
    }
  };

  let retData = [];
  await Promise.all(
    idArray.map(async (id) => {
      var data = await getContactData(id);
      return retData.push(data);
    })
  );

  res.status(200).json({ status: "Ok", data: retData });
};
