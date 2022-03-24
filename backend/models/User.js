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
  smtpSettings: {
    type: Object,
    default: {
      smtp_host: "",
      smtp_user: "",
      smtp_pass: "",
      smtp_port: 25,
      smtp_sender: ""
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
  },
  dailyUnlock: {
    type: Number,
    default: 0
  },
  monthlyUnlock: {
    type: Number,
    default: 0
  },
  dateUnlockDaily: {
    type: String,
    default: null
  },
  downloads: {
    type: Number,
    default: 0
  },
  showGuide: {
    type: Boolean,
    default: true
  }
});
const User = mongoose.model("users", UserSchema);
module.exports = User;
