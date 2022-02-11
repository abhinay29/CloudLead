const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    default: null
  },
  country_code: {
    type: String,
    default: null
  },
  company: {
    type: String,
    default: null
  },
  plan_id: {
    type: String,
    default: null
  },
  status: {
    type: Number,
    default: 0
  },
  billing_info: {
    type: Object,
    default: {
      address: "",
      city: "",
      state: "",
      country: "",
      pin: "",
      gst: false,
      gst_number: ""
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    default: null,
    unique: true
  },
  loginHistory: {
    type: Array
  }
});
const User = mongoose.model("users", UserSchema);
module.exports = User;
