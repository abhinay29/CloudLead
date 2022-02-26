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

const rand = () => Math.random(0).toString(36).substr(2);
const getToken = (length = 32) =>
  (rand() + rand() + rand() + rand()).substr(0, length);

router.get("/test", Test);
router.get("/", fetchuser, Filter);

router.post("/unlock", fetchuser, async (req, res) => {
  try {
    const { cid } = req.body;

    const userData = await User.findOne({ _id: req.user.id });

    if (!userData) {
      res.status(401).json({
        status: "error",
        error: "Unauthorised access"
      });
    }

    const Plan = await Plans.findOne({ plan_id: userData.plan_id });

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let checkWatchlist = await Watchlist.findOne({
      user: req.user.id,
      contact_id: cid
    });

    if (checkWatchlist !== null) {
      res.status(200).json({
        status: "exist",
        msg: "Contact is already in your watchlist"
      });
      return false;
    }

    let checkWatchlistCount = await Watchlist.count({ user: req.user.id });

    if (Plan.unlock_daily < checkWatchlistCount) {
      res.status(200).json({
        status: "limit_reached",
        msg: "Your daily unlock limit is reached, upgrade your plan or visit again tomorrow"
      });
      return false;
    }

    const watchlist = new Watchlist({
      user: req.user.id,
      contact_id: cid
    });

    const savedWatchlist = await watchlist.save();

    const query = { _id: cid };

    try {
      const data = await Contacts.findOne(query).select([
        "-_id",
        "email_confidence_level",
        "email"
      ]);

      res.status(200).json({
        status: "success",
        data: data
      });
    } catch (error) {
      console.error(error.message);
      res.status(200).send(error.message);
    }
  } catch (error) {
    console.error(error.message);
    res.status(200).send(error.message);
  }
});

router.post("/unlockbulk", fetchuser, async (req, res) => {
  // if (!req.body.ids) {
  //   res.status(200).json({
  //     status: 'error',
  //     error: 'Invalid query'
  //   });
  // }

  const userData = await User.findOne({ _id: req.user.id });

  if (!userData) {
    res.status(401).json({
      status: "error",
      error: "Unauthorised access"
    });
  }

  const Plan = await Plans.findOne({ plan_id: userData.plan_id });

  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      res.status(200).json({
        status: "error",
        message: "Invalid access of blank data"
      });
    }

    let checkWatchlistCount = await Watchlist.count({ user: req.user.id });

    if (Plan.unlock_daily > checkWatchlistCount) {
      if (ids.length > Plan.unlock_daily) {
        res.status(200).json({
          status: "limit_reached",
          msg: `You can only get contact '${Plan.unlock_daily}' in a day`
        });
        return false;
      }
    } else {
      res.status(200).json({
        status: "limit_reached",
        msg: "Your daily unlock limit is reached, upgrade your plan or visit again tomorrow"
      });
      return false;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let watchlist;
    let count = 0;
    let check;
    for (var x = 0; x < ids.length; x++) {
      check = await Watchlist.findOne({
        user: req.user.id,
        contact_id: ids[x]
      });
      if (!check) {
        watchlist = await Watchlist.create({
          user: req.user.id,
          contact_id: ids[x]
        });
        if (watchlist) {
          count++;
        }
      }
    }

    const query = { _id: { $in: ids } };

    try {
      const data = await Contacts.find(query).select([
        "email_confidence_level",
        "email"
      ]);
      res.status(200).json({
        status: "success",
        data: data,
        unlocked: count
      });
    } catch (error) {
      console.error(error.message);
      res.status(200).send(error.message);
    }
  } catch (error) {
    console.error(error.message);
    res.status(200).send(error.message);
  }
});

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
