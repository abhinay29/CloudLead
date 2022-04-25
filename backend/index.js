require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();
const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
// app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200
  })
);

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/companies", require("./routes/companies"));
app.use("/api/cities", require("./routes/cities"));
app.use("/api/countries", require("./routes/countries"));
app.use("/api/states", require("./routes/states"));
app.use("/api/user", require("./routes/userdata"));
app.use("/api/plans", require("./routes/plans"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/campaign", require("./routes/campaign"));

app.listen(port, () => {
  console.log(`Cloudlead API listening at http://localhost:${port}`);
});
