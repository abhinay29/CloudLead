const FreezedData = require("../../models/FreezedData");

module.exports = async (req, res) => {
  const userId = req.user.id;
  try {
    let getData = await FreezedData.find({ userId: userId });

    // let resData = [];

    // await getData.map((d) => {
    //   var date = new Date(d.date);
    //   date = date.toLocaleString();
    //   return resData.push({
    //     search_details: d.search_details,
    //     search_name: d.search_name,
    //     search_id: d.search_id,
    //     email_count: d.email_count,
    //     directDial_count: d.directDial_count,
    //     date: date
    //   });
    // });

    return res.status(200).json({
      status: "success",
      data: getData
    });
  } catch (err) {
    return res.status(200).json({ status: "error", error: err });
  }
};
