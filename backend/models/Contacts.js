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
    ref: "data_companies",
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
  organization: {
    company_type: {
      type: String
    },
    organization_name: {
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
    industry: {
      type: String
    },
    primary_domain: {
      type: String
    },
    keywords: {
      type: String
    },
    revenue: {
      type: String
    },
    employee_range: {
      type: String
    }
  }
});

module.exports = mongoose.model("peoples", ContactSchema);
