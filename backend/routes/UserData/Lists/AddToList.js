const { lists } = require("../../../models/UserData");

module.exports = async (req, res) => {
  const user_id = req.user.id;
  try {
    let CheckUser = await savedSearch.findOne({ userId: user_id });
    let data = {
      name: req.body.name,
      query: req.body.query
    };
    let updateQuery = CheckUser.data;
    updateQuery.push(data);

    await savedSearch.findByIdAndUpdate(
      CheckUser._id,
      { $set: { data: updateQuery } },
      { new: true }
    );

    res.status(200).json({ status: "success" });
  } catch {
    // console.log("Create")
    let CreateSearch = await savedSearch.create({
      userId: user_id,
      data: [
        {
          name: req.body.name,
          query: req.body.query
        }
      ]
    });
    res.status(200).json({ status: "success" });
  }
};
