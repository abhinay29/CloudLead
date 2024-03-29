const mongoose = require("mongoose");
const { Schema } = mongoose;

const ContactSchema = new Schema({
  person_id: {
    type: String,
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
  title: {
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
  department: {
    type: String
  },
  role: {
    type: String
  },
  company_id: {
    type: String,
    ref: "companies",
    required: true
  },
  seniority: {
    type: String
  },
  email_confidence_level: {
    type: String
  },
  email: {
    type: String
  },
  linkedin_id: {
    type: String
  },
  direct_dial: {
    trpe: String
  },
  organization: {
    company_type: {
      type: String
    },
    organization_name: {
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
    industry: {
      type: String
    },
    primary_website_domain: {
      type: String
    },
    keywords: {
      type: String
    },
    annual_revenue: {
      type: String
    },
    size_range: {
      type: String
    }
  }
});

module.exports = mongoose.model("peoples", ContactSchema);
