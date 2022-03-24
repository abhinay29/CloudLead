const User = require("../../models/User");

module.exports = async (req, res) => {
  let status = req.body.status === 0 ? false : true;

  await User.findByIdAndUpdate(
    { _id: req.user.id },
    {
      showGuide: status
    },
    function (err, data) {
      if (err) {
        throw err;
      } else {
        res.status(200).json({
          status: "success"
        });
      }
    }
  )
    .clone()
    .catch(function (err) {
      console.log(err);
      res.status(200).json({ status: "error" });
    });
};
