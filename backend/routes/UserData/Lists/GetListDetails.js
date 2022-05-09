const { Lists } = require("../../../models/UserData");

module.exports = async (req, res) => {
  let query = { userId: req.user.id };
  if (req.query.s) {
    query = {
      userId: req.user.id,
      list_name: { $regex: req.query.s, $options: "i" }
    };
  }
  let list = await Lists.find(query).select(["list_name", "list_data", "_id"]);
  if (list) {
    res.status(200).json({
      status: "success",
      lists: list.map((l) => {
        return {
          id: l._id,
          name: l.list_name,
          rcptcount: l.list_data.length ? l.list_data.length : 0
        };
      })
    });
  } else {
    res.status(200).send(false);
  }
};
