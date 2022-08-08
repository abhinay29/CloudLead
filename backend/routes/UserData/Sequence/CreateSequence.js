const { sequenceList } = require("../../../models/UserData");

module.exports = async (req, res) => {
  const user_id = req.user.id;

  let CheckSequence = await sequenceList.findOne({
    userId: user_id,
    name: req.body.name
  });
  if (CheckSequence) {
    return res.status(200).json({
      status: "error",
      error: "Name for sequence is already exists, type new name."
    });
  }

  let emails = [];

  await sequenceList.create({
    userId: user_id,
    name: req.body.name,
    frequency: req.body.frequency,
    days: req.body.days,
    start_datetime: req.body.start_datetime,
    emails: emails
  });

  res
    .status(200)
    .json({ status: "success", message: "Sequence Created Successfully." });
};
