const Watchlist = require("../../models/Watchlist");

module.exports = async (req, res) => {
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
};
