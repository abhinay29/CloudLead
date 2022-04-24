const FreezedData = require("../../models/FreezedData");

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { searchId } = req.body;
  try {
    let delData = await FreezedData.deleteOne({
      userId: userId,
      search_id: searchId
    });
    return res.status(200).json({
      status: "success"
    });
  } catch (err) {
    return res.status(200).json({ status: "error", error: err });
  }
};
