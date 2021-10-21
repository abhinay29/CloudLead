const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlansDB = new Schema({
  plan_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  download: {
    type: Number,
    required: true
  },
  unlock_month: {
    type: Number,
    required: true
  },
  unlock_daily: {
    type: Number,
    required: true
  },
  select_perpage: {
    type: Number,
    required: true
  },
  sendto_campaign: {
    type: String,
    required: true
  },
  repeat_campaign: {
    type: Number,
    required: true
  },
  csv_upload: {
    type: Number,
    required: true
  },
  free_data: {
    type: Number,
    required: true
  },
  price_inr: {
    type: Number,
    required: true
  },
  price_usd: {
    type: Number,
    required: true
  }
});

const Plans = mongoose.model('plans', PlansDB);

module.exports = Plans;