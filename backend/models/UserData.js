const mongoose = require("mongoose");
const { Schema } = mongoose;

const SavedSearch = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    unique: true,
    required: true
  },
  data: [
    {
      name: {
        type: String,
        required: true
      },
      query: {
        type: Object,
        required: true
      }
    }
  ]
});

const savedSearch = mongoose.model("saved_search", SavedSearch);

const SavedCompanySearch = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    unique: true,
    required: true
  },
  data: [
    {
      name: {
        type: String,
        required: true
      },
      query: {
        type: Object,
        required: true
      }
    }
  ]
});

const savedCompanySearch = mongoose.model(
  "saved_company_search",
  SavedCompanySearch
);

const List = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: false
  },
  list_name: {
    type: String,
    required: true
  },
  list_data: {
    type: Array,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const lists = mongoose.model("lists", List);

const Sequences = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: false
  },
  name: {
    type: String,
    default: ""
  },
  frequency: {
    type: String
  },
  days: {
    type: Object,
    default: {}
  },
  start_date: {
    type: String
  },
  start_time: {
    type: String
  },
  emails: {
    type: Array,
    default: []
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const sequences = mongoose.model("sequences", Sequences);

const Templates = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: false
  },
  template_name: {
    type: String,
    required: true
  },
  template_subject: {
    type: String,
    required: true
  },
  template_content: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const templates = mongoose.model("templates", Templates);

const Campaign = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: false
  },
  list_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sequences",
    required: true,
    unique: false
  },
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "templates",
    required: true,
    unique: false
  },
  sent: {
    type: Boolean,
    default: false
  },
  added_at: {
    type: Date,
    default: Date.now
  }
});

const campaign = mongoose.model("campaign", Campaign);

module.exports = {
  savedSearch: savedSearch,
  savedCompanySearch: savedCompanySearch,
  sequenceList: sequences,
  Lists: lists,
  templates: templates,
  campaign: campaign
};
