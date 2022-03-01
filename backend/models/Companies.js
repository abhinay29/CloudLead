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
  primary_domain: {
    type: String
  },
  website_url: {
    type: String
  },
  industry: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  revenue: {
    type: String
  },
  employee_range: {
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
  }
});

module.exports = mongoose.model("companies", CompanySchema);
