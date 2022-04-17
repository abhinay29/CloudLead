const FreezedData = require("../../models/FreezedData");

module.exports = async (req, res) => {
  const userId = req.user.id;
  const { search_name, search_filter } = req.body;
  try {
    let saveData = await FreezedData.create({
      userId: userId,
      search_name: search_name,
      search_filter: search_filter
    });
    return res.status(200).json({
      status: "success"
    });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err });
  }
};
