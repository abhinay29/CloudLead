const mongoose = require("mongoose");
const { Schema } = mongoose;

const CompanySchema = new Schema({
  company_id: {
    type: String,
    unique: true,
    require: true
  },
  organization_name: {
    type: String
  },
  primary_website_domain: {
    type: String
  },
  website_link: {
    type: String
  },
  industry: {
    type: String
  },
  org_city: {
    type: String
  },
  org_state: {
    type: String
  },
  org_country: {
    type: String
  },
  annual_revenue: {
    type: String
  },
  size_range: {
    type: String
  },
  org_linkedin_url: {
    type: String
  },
  organization_type: {
    type: String
  },
  keywords: {
    type: String
  },
  short_description: {
    type: String
  }
});

module.exports = mongoose.model("companies", CompanySchema);
