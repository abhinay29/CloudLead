const User = require("../../models/User");

module.exports = async (req, res) => {
  const { smtp_host, smtp_user, smtp_pass, smtp_port, smtp_sender } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user.id },
    {
      smtpSettings: { smtp_host, smtp_user, smtp_pass, smtp_port, smtp_sender }
    },
    function (err, data) {
      if (err) {
        return res.status(200).json({ status: "error", error: err });
      } else {
        res.status(200).json({
          status: "success",
          message: "SMTP details saved successfully"
        });
      }
    }
  );
};
