const mongoose = require("mongoose");
const { Schema } = mongoose;

const FreezeDataSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  search_id: {
    type: String,
    default: null
  },
  search_name: {
    type: String,
    default: null
  },
  search_details: {
    type: Object,
    default: {}
  },
  email_count: {
    type: Number,
    default: 0
  },
  directDial_count: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
const FreezedData = mongoose.model("freeze_list", FreezeDataSchema);
module.exports = FreezedData;
