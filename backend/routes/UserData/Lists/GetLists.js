const { Lists } = require("../../../models/UserData");

module.exports = async (req, res) => {
  let list = await Lists.find({ userId: req.user.id }).select([
    "list_name",
    "-_id"
  ]);
  if (list) {
    res.status(200).json({
      status: "success",
      lists: list.map((l) => {
        return l.list_name;
      })
    });
  } else {
    res.status(200).send(false);
  }
};
