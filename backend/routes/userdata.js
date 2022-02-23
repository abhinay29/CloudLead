const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const transporter = require("../middleware/mailTransporter");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Transactions = require("../models/Payments");
const {
  savedSearch,
  savedCompanySearch,
  sequenceList,
  templates
} = require("../models/UserData");

const adminEmail = process.env.ADMIN_EMAIL;

router.get("/", fetchuser, async (req, res) => {
  let Check = await User.findOne({ _id: req.user.id });
  if (Check.plan_id) {
    res.status(200).json({ status: true });
  } else {
    res.status(200).json({ status: false });
  }
});

router.post("/verify", async (req, res) => {
  // req.body.token
  let Check = await User.findOne({ token: req.body.token, status: 0 });
  if (Check) {
    await User.updateOne({ _id: Check._id }, { status: 1 });
    res.status(200).json({ status: true });
  } else {
    res.status(200).json({ status: false });
  }
});

router.post("/savesearch", fetchuser, async (req, res) => {
  const user_id = req.user.id;

  try {
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
      console.log("Create");
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
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/savedsearch", fetchuser, async (req, res) => {
  const user_id = req.user.id;
  try {
    let fetchSavedSearch = await savedSearch
      .findOne({ userId: user_id })
      .select(["data", "-_id"]);
    res.status(200).json({
      status: "success",
      result: fetchSavedSearch
    });
  } catch (error) {
    res.status(202).json({
      msg: "saved search not found"
    });
  }
});

router.post("/savecompanysearch", fetchuser, async (req, res) => {
  const user_id = req.user.id;

  try {
    try {
      let CheckUser = await savedCompanySearch.findOne({ userId: user_id });
      let data = {
        name: req.body.name,
        query: req.body.query
      };
      let updateQuery = CheckUser.data;
      updateQuery.push(data);

      await savedCompanySearch.findByIdAndUpdate(
        CheckUser._id,
        { $set: { data: updateQuery } },
        { new: true }
      );

      res.status(200).json({ status: "success" });
    } catch {
      console.log("Create");
      let CreateSearch = await savedCompanySearch.create({
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
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/savedcompanysearch", fetchuser, async (req, res) => {
  const user_id = req.user.id;
  try {
    let fetchSavedSearch = await savedCompanySearch
      .findOne({ userId: user_id })
      .select(["data", "-_id"]);
    res.status(200).json({
      status: "success",
      result: fetchSavedSearch
    });
  } catch (error) {
    res.status(202).json({
      msg: "saved search not found"
    });
  }
});

router.post("/add-to-list", fetchuser, async (req, res) => {
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
});

router.get("/list", fetchuser, async (req, res) => {
  let lists = await sequenceList
    .find({ userId: req.user.id })
    .select(["list_name", "-_id"]);
  if (lists) {
    res.status(200).json({
      status: "success",
      lists: lists.map((l) => {
        return l.list_name;
      })
    });
  } else {
    res.status(200).send(false);
  }
});

router.get("/list/detailed", fetchuser, async (req, res) => {
  let lists = await sequenceList
    .find({ userId: req.user.id })
    .select(["list_name", "list_data", "_id"]);
  if (lists) {
    res.status(200).json({
      status: "success",
      lists: lists.map((l) => {
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
});

router.post("/list/add", fetchuser, async (req, res) => {
  const user_id = req.user.id;
  const listName = req.body.name;
  const ids = req.body.ids;

  // Check list exist

  let check = await sequenceList.findOne({
    userId: user_id,
    list_name: listName
  });
  if (!check) {
    const addList = await sequenceList.create({
      userId: user_id,
      list_name: listName,
      list_data: ids
    });
    if (!addList)
      return res.status({
        status: "error",
        error: "Cannot add list this time."
      });

    return res.status(200).json({
      status: "success",
      data: { id: addList._id, name: addList.list_name },
      message: "List added to sequences successfully"
    });
  } else {
    let newList = check.list_data;
    let count = newList.length;

    ids.map((id) => {
      if (newList.indexOf(id) === -1) newList.push(id);
    });

    count = newList.length - count;

    const updateList = await sequenceList.findByIdAndUpdate(
      { _id: check._id },
      {
        list_data: newList
      }
    );

    if (!updateList)
      return res
        .status(200)
        .json({ status: "error", error: "Cannot update list this time." });

    res.status(200).json({
      status: "success",
      message: `${count} emails added to sequence list.`,
      count: count
    });
  }
});

router.get("/templates", fetchuser, async (req, res) => {
  let template_list = await templates.find({ userId: req.user.id });
  if (template_list) {
    res.status(200).json({
      status: "success",
      template_list: template_list.map((l) => {
        return {
          name: l.template_name,
          subject: l.template_subject,
          addedon: l.created_at
        };
      })
    });
  } else {
    res.status(200).send(false);
  }
});

router.post("/template/create", fetchuser, async (req, res) => {
  const user_id = req.user.id;
  const { name, subject, content } = req.body;

  const addTemplate = await templates.create({
    userId: user_id,
    template_name: name,
    template_subject: subject,
    template_content: content
  });
  if (!addTemplate)
    return res.status(200).json({
      status: "error",
      error: "Cannot create template this time, please try again later."
    });

  return res.status(200).json({
    status: "success",
    message: "Template create successfully."
  });
});

router.post("/template/delete", fetchuser, async (req, res) => {
  const user_id = req.user.id;
  const { temp_id } = req.body;

  const addTemplate = await templates.deleteOne({
    _id: temp_id
  });
  if (!addTemplate)
    return res.status(200).json({
      status: "error",
      error: "Cannot delete template this time, please try again later."
    });

  return res.status(200).json({
    status: "success",
    message: "Template Deleted successfully."
  });
});

router.get("/checkphone/:phone", fetchuser, async (req, res) => {
  let user = await User.findOne({ phone: req.params.phone });
  if (user) {
    return res.status(200).json({
      status: "error",
      error: "Sorry a user with this phone number is already exists"
    });
  } else {
    return res.status(200).json({ status: "success" });
  }
});

router.post("/subscribe", fetchuser, async (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user.id },
    {
      phone: req.body.phone,
      plan_id: req.body.plan,
      company: req.body.company
    },
    function (err, data) {
      if (err) {
        return res.status(200).json({ status: "error", error: err });
      } else {
        res.status(200).json({ status: "success" });
      }
    }
  );
});

router.post("/update/profile", fetchuser, async (req, res) => {
  const { country_code, phone, company } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { country_code, phone, company },
    function (err, data) {
      if (err) {
        return res.status(200).json({ status: "error", error: err });
      } else {
        res.status(200).json({ status: "success" });
      }
    }
  );
});

router.post("/update/billing", fetchuser, async (req, res) => {
  const { address, city, state, country, pin, gst, gst_number } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user.id },
    { billing_info: { address, city, state, country, pin, gst, gst_number } },
    function (err, data) {
      if (err) {
        return res.status(200).json({ status: "error", error: err });
      } else {
        res.status(200).json({ status: "success" });
      }
    }
  );
});

router.post("/billinghistory", fetchuser, async (req, res) => {
  try {
    const trans = await Transactions.find({ user: req.user.id })
      .select(["amount", "date", "orderId", "status"])
      .sort("-date");
    res.status(200).json({ status: "success", data: trans });
  } catch (error) {
    return res.status(200).json({ status: "error", error: error });
  }
});

router.post("/changepassword", fetchuser, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(200).json({
        status: "error",
        error: "Please try to login with correct credentials"
      });
    }

    const passwordCompare = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!passwordCompare) {
      return res
        .status(200)
        .json({ status: "error", error: "Invalid current password." });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt);

    User.findByIdAndUpdate(
      { _id: req.user.id },
      { password: secPass },
      function (err, data) {
        if (err) {
          return res.status(200).json({ status: "error", error: err });
        } else {
          res.status(200).json({ status: "success" });
          transporter.sendMail({
            from: `"Cloudlead" <${adminEmail}>`,
            to: user.email,
            subject: "Confirmation: Password Changed", // Subject line
            html: `<h6>Dear User,</h6>
              <p>You have successfully change password for your account.</p>
              <p> </p>
              <p>Have a wonderful day!</p>
              <p>Team Cloudlead</p>
            `
          });
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(401).send("Authentication failed.");
  }
});

module.exports = router;
