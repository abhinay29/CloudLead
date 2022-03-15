const mongoose = require("mongoose");
const { Schema } = mongoose;

const CitySchema = new Schema({
  name: {
    type: String
  }
});
module.exports = mongoose.model("cities", CitySchema);
