require("dotenv").config();
const useExport = require("../../models/Export");
const transporter = require("../../middleware/mailTransporter");
const User = require("../../models/User");
const hostWebsite = process.env.APP_URL;
const adminEmail = process.env.ADMIN_EMAIL;

const rand = () => Math.random(0).toString(36).substr(2);
const getToken = (length = 32) =>
  (rand() + rand() + rand() + rand()).substr(0, length);

module.exports = async (req, res) => {
  if (req.body.ids.length === 0) {
    return res.status(404).json({
      status: "error",
      error: "Please select records to export from watchlist"
    });
  }

  const Token = getToken(32);

  let user = await User.findOne({ _id: req.user.id }).select([
    "-_id",
    "downloads"
  ]);
  let downloads = user.downloads.daily ? user.downloads.daily : 0;
  downloads = downloads + req.body.ids.length;
  let downloads_monthly = user.downloads.monthly ? user.downloads.monthly : 0;
  downloads_monthly = downloads_monthly + req.body.ids.length;
  try {
    let Export = await useExport.create({
      user: req.user.id,
      contactIds: req.body.ids,
      token: Token
    });
    if (Export) {
      transporter.sendMail({
        from: `"Cloudlead" <${adminEmail}>`,
        to: req.body.email,
        subject: "Download is ready!!!",
        html: `<h5>Hello,</h5>
          <p>Your download is ready now, you can download CSV file by clicking below link.</p>
          <p><a href="${hostWebsite}/download/${Token}">${hostWebsite}/download/${Token}</a></p>
          <p></p>
          <p>Have a wonderful day!</p>
          <p>Team Cloudlead</p>
        `
      });
      await User.updateOne(
        { _id: req.user.id },
        {
          $set: {
            "downloads.daily": downloads,
            "downloads.monthly": downloads_monthly
          }
        },
        { upsert: true }
      );
      res.status(200).json({ status: "success" });
    } else {
      res.status(200).json({ status: "error" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
