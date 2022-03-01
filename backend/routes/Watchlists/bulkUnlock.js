const User = require("../../models/User");
const Plans = require("../../models/Plans");
const { body, validationResult } = require("express-validator");
const Watchlist = require("../../models/Watchlist");
const Contacts = require("../../models/Contacts");

module.exports = async (req, res) => {
  // if (!req.body.ids) {
  //   res.status(200).json({
  //     status: 'error',
  //     error: 'Invalid query'
  //   });
  // }

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

  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(200).json({
        status: "error",
        message: "Invalid access of blank data"
      });
    }

    let checkWatchlistCount = await Watchlist.count({ user: req.user.id });

    let dailyUnlock = userData.dailyUnlock ? userData.dailyUnlock : 0;
    let monthlyUnlock = userData.monthlyUnlock ? userData.monthlyUnlock : 0;

    if (Plan.unlock_daily <= dailyUnlock) {
      // if (ids.length > Plan.unlock_daily) {
      // return res.status(200).json({
      //   status: "limit_reached",
      //   msg: `You can only get contact '${Plan.unlock_daily}' in a day`
      // });
      // }
      return res.status(200).json({
        status: "limit_reached",
        msg: "Your daily unlock limit is reached, upgrade your plan or visit again tomorrow"
      });
    }

    if (dailyUnlock + ids.length > Plan.unlock_daily) {
      return res.status(200).json({
        status: "limit_reached",
        msg: `Your daily limit left only ${Plan.unlock_daily - dailyUnlock}`
      });
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

    if (count > 0) {
      try {
        await User.updateOne(
          { _id: req.user.id },
          {
            $set: {
              dailyUnlock: dailyUnlock + count,
              monthlyUnlock: monthlyUnlock + count
            }
          },
          { upsert: true }
        );
      } catch (err) {
        console.log(err);
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
};
