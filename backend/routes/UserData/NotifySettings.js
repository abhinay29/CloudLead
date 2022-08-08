const User = require("../../models/User");

module.exports = async (req, res) => {
  const { adminEmails, generalEmails } = req.body;
  let ae = adminEmails.split(",");
  let ge = generalEmails.split(",");
  User.findByIdAndUpdate(
    { _id: req.user.id },
    {
      notificationSettings: {
        generalEmails: ge,
        adminEmails: ae
      }
    },
    { upsert: true },
    function (err, data) {
      if (err) {
        return res.status(200).json({ status: "error", error: err });
      } else {
        res.status(200).json({
          status: "success",
          message: "Notification emails updated successfully"
        });
      }
    }
  );
};
