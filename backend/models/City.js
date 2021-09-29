const mongoose = require('mongoose');
const { Schema } = mongoose;

const CitySchema = new Schema({
  value: {
    type: String,
  },
  label: {
    type: String,
  },
});
module.exports = mongoose.model('cities', CitySchema);