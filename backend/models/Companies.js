const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
  company_id: {
    type: String,
    unique: true,
    require: true,
  },
  company_size_range: {
    type: String,
  },
  company_type: {
    type: String,
  },
  company_name: {
    type: String,
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
  linkedin_link: {
    type: String,
  },
  keyword: {
    type: String,
  },
  domain: {
    type: String,
  },
  website: {
    type: String,
  }
});

module.exports = mongoose.model('data_companies', CompanySchema);