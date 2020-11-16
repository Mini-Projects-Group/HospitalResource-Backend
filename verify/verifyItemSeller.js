const connection = require("../db/connection");
const util = require("util");

const query = util.promisify(connection.query).bind(connection);

const verifyItemSeller = async (req, res, next) => {
  try {
    let selectQuery =
      "SELECT * FROM item WHERE item_id = " + req.params.item_id + ";";

    const result = await query(selectQuery);

    if (result.length == 0) {
      res.status(404);
      return res.json({ message: "Not Registered", error: true });
    }
    if (req.user.seller_id === result[0].seller_id) {
      //console.log(req.user);
      next();
    } else {
      res.status(403).json({ message: "Action Prohibited", error: true });
    }
  } catch (error) {
    console.log("cdsinvdvndj");
    res.status(400).json({ message: "Some error occured", error: true });
  }
};

module.exports = verifyItemSeller;
