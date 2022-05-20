const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
// const Contacts = require("../models/Contacts");
// const Company = require("../models/Companies");
// const Watchlist = require("../models/Watchlist");
// const useExport = require("../models/Export");
// const { body, validationResult } = require("express-validator");
// const User = require("../models/User");
// const Plans = require("../models/Plans");
// const {
//   Fields,
//   ConvertStringRegex,
//   RoleFields,
//   APIfeatures
// } = require("./Classes/clsGlobal");
const Test = require("./Contacts/test");
const Filter = require("./Contacts/Filter");
const GetWatchlist = require("./Watchlists/getWatchlist");
const singleUnlock = require("./Watchlists/singleUnlock");
const bulkUnlock = require("./Watchlists/bulkUnlock");
const selections = require("./Watchlists/selections");
const deleteWatchlist = require("./Watchlists/deleteWatchlist");
const FilterCounts = require("./Contacts/FilterCounts");

const rand = () => Math.random(0).toString(36).substr(2);
const getToken = (length = 32) =>
  (rand() + rand() + rand() + rand()).substr(0, length);

router.get("/test", Test);
router.get("/", fetchuser, Filter);
router.get("/counts", fetchuser, FilterCounts);
router.post("/unlock", fetchuser, singleUnlock);
router.post("/unlockbulk", fetchuser, bulkUnlock);
router.get("/watchlist", fetchuser, GetWatchlist);
router.post("/watchlist/export", fetchuser, require("./Contacts/export"));
router.get("/watchlist/download", require("./Contacts/downloadcsv"));
router.delete("/deletewatchlist", fetchuser, deleteWatchlist);
router.get("/watchlist/selection", fetchuser, selections);

module.exports = router;
