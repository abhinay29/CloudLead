const mongoose = require('mongoose');
const { Schema } = mongoose;

const StateSchema = new Schema({
  value: {
    type: String,
  },
  label: {
    type: String,
  },
});
module.exports = mongoose.model('states', StateSchema);