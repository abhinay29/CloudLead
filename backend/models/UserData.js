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

const sequenceList = mongoose.model("sequences", List);

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

module.exports = {
  savedSearch: savedSearch,
  savedCompanySearch: savedCompanySearch,
  sequenceList: sequenceList,
  templates: templates
};
