const mongoose = require("mongoose");

const mongoURI =
  "mongodb://admin:napster@localhost:27017/cloudlead?authSource=admin&readPreference=primary&appname=NodeJsAPI&directConnection=true&ssl=false";

const connectToMongo = () => {
  // mongoose.connect(mongoURI, () => {
  //   console.log("Connected to MongoDB Successfully");
  // });
  mongoose
    .connect(mongoURI, {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then((x) => {
      console.log("Connected to MongoDB Successfully");
      console.log(
        `Connected to Mongo! Database name: "${x.connections[0].name}"`
      );
    })
    .catch((err) => {
      console.error("Error connecting to mongo", err);
    });
  return mongoose;
};

module.exports = connectToMongo;
