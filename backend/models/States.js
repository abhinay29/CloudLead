const mongoose = require("mongoose");
const { Schema } = mongoose;

const StateSchema = new Schema({
  name: {
    type: String
  }
});
module.exports = mongoose.model("states", StateSchema);
