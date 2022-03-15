require("dotenv").config();
const connectToMongo = require("./db");
const User = require("./models/User");
const { sequenceList, templates, campaign } = require("./models/UserData");

try {
  const camp = campaign.findOne({}, function (err, docs) {
    if (docs) {
      console.log(JSON.stringify(docs));
    }
  });
} catch (error) {
  console.error(error.message);
}
