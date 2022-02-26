const mongoose = require("mongoose");
const { Schema } = mongoose;

const WatchlistSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  contact_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "peoples",
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("person_watchlists", WatchlistSchema);
