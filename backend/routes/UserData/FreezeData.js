const FreezedData = require("../../models/FreezedData");

module.exports = async (req, res) => {
  const userId = req.user.id;
  const {
    searchId,
    searchName,
    searchString,
    emailCount,
    direactDial,
    emailCheck,
    directDialCheck
  } = req.body;
  try {
    let saveData = await FreezedData.create({
      userId: userId,
      search_id: searchId,
      search_name: searchName,
      search_details: searchString,
      email_count: emailCheck ? emailCount : 0,
      directDial_count: directDialCheck ? direactDial : 0
    });
    return res.status(200).json({
      status: "success",
      msg: "Contacts added to freeze list, can be viewed in 'My Freezes'"
    });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err });
  }
};
