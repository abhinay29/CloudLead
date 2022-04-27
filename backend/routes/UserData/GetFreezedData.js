const FreezedData = require("../../models/FreezedData");
let carryForwardCount = 0;
let carryForwardCost = 0;
let totalPrice = 0;

class priceCalclulater {
  constructor(ec) {
    this.ec = ec;
  }

  calc() {
    let remain = 0;
    let price = 0;
    let count = 0;
    // let carryForwardCount = 0;

    if (carryForwardCount > 0) {
      price = carryForwardCount * carryForwardCost;
      count = this.ec - carryForwardCount;
      console.log("Count: ", count);
      console.log("Price: ", price);
    } else {
      count = this.ec;
    }

    if (count > 2000) {
      price = 2000 * 2.5;
      remain = count - 2000;
      if (remain > 3000) {
        price = price + 3000 * 1.75;
        remain = remain - 3000;
        if (remain > 5000) {
          price = price + 5000 * 1;
          remain = remain - 5000;
          if (remain > 10000) {
            price = price + 10000 * 0.7;
            remain = remain - 10000;
            if (remain > 0) {
              price = price + remain * 0.5;
            }
          } else {
            price = price + remain * 0.7;
            carryForwardCount = 10000 - remain;
            if (carryForwardCount > 0) {
              carryForwardCost = 2.5;
            }
          }
        } else {
          price = price + remain * 1;
          carryForwardCount = 5000 - remain;
          if (carryForwardCount > 0) {
            carryForwardCost = 2.5;
          }
        }
      } else {
        price = price + remain * 1.75;
        carryForwardCount = 3000 - remain;
        if (carryForwardCount > 0) {
          carryForwardCost = 2.5;
        }
      }
    } else {
      price = count * 2.5;
      carryForwardCount = 2000 - count;
      if (carryForwardCount > 0) {
        carryForwardCost = 2.5;
      }
    }
    totalPrice = totalPrice + price;
    return price;
  }
}

module.exports = async (req, res) => {
  const userId = req.user.id;
  try {
    let getData = await FreezedData.find({ userId: userId });
    // var remainCount;
    // var cost;

    let resData = [];

    getData.map((d) => {
      var date = new Date(d.date);
      date = date.toLocaleString();
      return resData.push({
        date: date,
        directDial_count: d.directDial_count,
        email_count: d.email_count,
        search_details: d.search_details,
        search_id: d.search_id,
        search_name: d.search_name,
        email_cost: new priceCalclulater(d.email_count).calc(),
        directDial_cost: 0,
        userId: d.userId,
        _id: d._id
      });
    });

    return res.status(200).json({
      status: "success",
      data: resData,
      totalPrice: totalPrice
    });
  } catch (err) {
    return res.status(200).json({ status: "error", error: err });
  }
};
