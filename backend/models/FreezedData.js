const mongoose = require("mongoose");
const { Schema } = mongoose;

const FreezeDataSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  search_name: {
    type: String,
    default: null
  },
  search_filter: {
    type: Object,
    default: {}
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
const FreezedData = mongoose.model("freezed_data", FreezeDataSchema);
module.exports = FreezedData;
