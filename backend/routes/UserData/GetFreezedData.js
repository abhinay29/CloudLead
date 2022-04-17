const FreezedData = require("../../models/FreezedData");

module.exports = async (req, res) => {
  const userId = req.user.id;
  try {
    let getData = await FreezedData.find({ userId: userId });

    let resData = [];

    await getData.map((d) => {
      var date = new Date(d.date);
      date = date.toLocaleString();
      return resData.push({
        search_filter: d.search_filter,
        search_name: d.search_name,
        date: date
      });
    });

    return res.status(200).json({
      status: "success",
      data: resData
    });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err });
  }
};
