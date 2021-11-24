const mongoose = require('mongoose');
const { Schema } = mongoose;

const PeopleSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'person_watchlists',
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  person_city: {
    type: String,
  },
  person_state: {
    type: String,
  },
  person_country: {
    type: String,
  },
  department: {
    type: String,
  },
  role: {
    type: String,
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
  },
  product_services: {
    type: String,
  },
  primary_mail_confidence: {
    type: String,
  },
  primary_email: {
    type: String,
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'data_companies',
    required: true
  }

});

module.exports = mongoose.model('data_peoples', PeopleSchema);