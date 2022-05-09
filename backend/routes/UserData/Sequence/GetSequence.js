const { sequenceList } = require("../../../models/UserData");

module.exports = async (req, res) => {
  let query = { userId: req.user.id };
  if (req.query.s) {
    query = {
      userId: req.user.id,
      name: { $regex: req.query.s, $options: "i" }
    };
  }
  let list = await sequenceList.find(query);
  if (list) {
    res.status(200).json({
      status: "success",
      sequenceList: list.map((l) => {
        return {
          id: l._id,
          name: l.name,
          frequency: l.frequency,
          start_time: l.start_time,
          start_date: l.start_date,
          days: l.days,
          contact_count: l.emails.length ? l.emails.length : 0
        };
      })
    });
  } else {
    res.status(200).send(false);
  }
};
