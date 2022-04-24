const Activity = require("../../models/UserActivity");

module.exports = async (req, res) => {
  const userId = req.user.id;
  let date = new Date();
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yy = date.getFullYear();
  let currentDate = yy + "-" + mm + "-" + dd;

  try {
    let activityData = await Activity.findOne({
      userId: userId,
      date: currentDate
    });
    return res.status(200).json({
      status: "success",
      unlocks: activityData.unlocks
    });
  } catch (err) {
    return res.status(200).json({ status: "Error", error: err });
  }
};
