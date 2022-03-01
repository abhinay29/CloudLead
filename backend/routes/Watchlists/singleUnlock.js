const User = require("../../models/User");
const Plans = require("../../models/Plans");
const { body, validationResult } = require("express-validator");
const Watchlist = require("../../models/Watchlist");
const Contacts = require("../../models/Contacts");

module.exports = async (req, res) => {
  try {
    const { cid } = req.body;

    let userData = await User.findOne({ _id: req.user.id });

    if (!userData) {
      res.status(401).json({
        status: "error",
        error: "Unauthorised access"
      });
    }

    let date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yy = date.getFullYear();
    let currentDate = dd + "-" + mm + "-" + yy;

    if (!userData.dateUnlockDaily) {
      try {
        await User.updateOne(
          { _id: req.user.id },
          { $set: { dateUnlockDaily: currentDate } },
          { upsert: true }
        );
      } catch (err) {
        console.log(err);
      }
    } else if (userData.dateUnlockDaily !== currentDate) {
      try {
        await User.updateOne(
          { _id: req.user.id },
          { $set: { dateUnlockDaily: currentDate, dailyUnlock: 0 } },
          { upsert: true }
        );
      } catch (err) {
        console.log(err);
      }
    }

    userData = await User.findOne({ _id: req.user.id });

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

    let dailyUnlock = userData.dailyUnlock ? userData.dailyUnlock : 0;
    let monthlyUnlock = userData.monthlyUnlock ? userData.monthlyUnlock : 0;

    if (checkWatchlist !== null) {
      res.status(200).json({
        status: "exist",
        msg: "Contact is already in your watchlist"
      });
      return false;
    }

    // let checkWatchlistCount = await Watchlist.count({ user: req.user.id });
    if (Plan.unlock_month <= monthlyUnlock) {
      return res.status(200).json({
        status: "limit_reached",
        msg: "Your monthly unlock limit is reached, upgrade your plan to unlock more"
      });
    }

    if (Plan.unlock_daily <= dailyUnlock) {
      return res.status(200).json({
        status: "limit_reached",
        msg: "Your daily unlock limit is reached, upgrade your plan or visit again tomorrow"
      });
    }

    const watchlist = new Watchlist({
      user: req.user.id,
      contact_id: cid
    });

    const savedWatchlist = await watchlist.save();

    if (savedWatchlist) {
      try {
        await User.updateOne(
          { _id: req.user.id },
          {
            $set: {
              dailyUnlock: dailyUnlock + 1,
              monthlyUnlock: monthlyUnlock + 1
            }
          },
          { upsert: true }
        );
      } catch (err) {
        console.log(err);
      }
    }

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
};
