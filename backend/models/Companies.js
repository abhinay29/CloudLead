const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
  department: {
    type: String,
  },
  company_size_range: {
    type: String,
  },
  Company_type: {
    type: String,
  },
  company_name: {
    type: String,
    unique: true,
  },
  company_city: {
    type: String,
  },
  company_state: {
    type: String,
  },
  company_country: {
    type: String,
  },
  revenue_range: {
    type: String,
  },
  industry: {
    type: String,
  },
  seniority_level: {
    type: String,
  },
  position: {
    type: String,
  },
  keyword: {
    type: String,
  },
  domain: {
    type: String,
  }
});

module.exports = mongoose.model('companies', CompanySchema);