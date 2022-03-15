const Company = require("../../models/Companies");

module.exports = async (req, res) => {
  try {
    const comp_data = await Company.findOne({
      company_id: req.params.id
    }).select([
      "_id",
      "company_id",
      "industry",
      "org_city",
      "org_country",
      "org_linkedin_url",
      "organization_name",
      "primary_phone_number",
      "size_range",
      "website_link",
      "founded_year",
      "short_description",
      "annual_revenue",
      "primary_website_domain"
    ]);
    res.status(200).json({
      status: "success",
      comp_data
    });
  } catch (error) {
    console.error(error.message);
    res.status(404).send("Company not found");
  }
};
