const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExportSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  contactIds: {
    type: Array,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("userexportlists", ExportSchema);
