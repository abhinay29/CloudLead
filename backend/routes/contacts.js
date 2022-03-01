const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Contacts = require("../models/Contacts");
const Company = require("../models/Companies");
const Watchlist = require("../models/Watchlist");
const useExport = require("../models/Export");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Plans = require("../models/Plans");
const {
  Fields,
  ConvertStringRegex,
  RoleFields,
  APIfeatures
} = require("./Classes/clsGlobal");
const Test = require("./Contacts/test");
const Filter = require("./Contacts/Filter");
const GetWatchlist = require("./Watchlists/getWatchlist");
const singleUnlock = require("./Watchlists/singleUnlock");
const bulkUnlock = require("./Watchlists/bulkUnlock");

const rand = () => Math.random(0).toString(36).substr(2);
const getToken = (length = 32) =>
  (rand() + rand() + rand() + rand()).substr(0, length);

router.get("/test", Test);
router.get("/", fetchuser, Filter);

router.post("/unlock", fetchuser, singleUnlock);
router.post("/unlockbulk", fetchuser, bulkUnlock);

router.get("/watchlist", fetchuser, GetWatchlist);
router.post("/watchlist/export", fetchuser, require("./Contacts/export"));
router.get("/watchlist/download", require("./Contacts/downloadcsv"));

router.delete("/deletewatchlist", fetchuser, async (req, res) => {
  if (req.body.ids.length === 0) {
    return res.status(404).json({
      status: "error",
      msg: "Please select people to remove from watchlist"
    });
  }

  try {
    let watchlist = await Watchlist.find({ user: req.user.id });
    if (!watchlist) {
      return res.status(404).json({ status: "error", msg: "Not Found" });
    }
    watchlist = await Watchlist.deleteMany({
      user: req.user.id,
      contact_id: {
        $in: req.body.ids.map((cid) => {
          return cid;
        })
      }
    });
    res.status(200).json({
      status: "success",
      deletedCount: watchlist.deletedCount
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
