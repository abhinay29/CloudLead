const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActivitySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  unlocks: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
const Activity = mongoose.model("user_activities", ActivitySchema);
module.exports = Activity;
