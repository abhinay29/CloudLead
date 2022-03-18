const mongoose = require("mongoose");
const { Schema } = mongoose;

const CountrySchema = new Schema({
  name: {
    type: String
  },
  phone_code: {
    type: String
  }
});
module.exports = mongoose.model("countries", CountrySchema);
