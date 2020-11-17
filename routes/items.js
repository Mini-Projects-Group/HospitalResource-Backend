const express = require("express");
const router = express.Router();
const passport = require("passport");
const connection = require("../db/connection");
const util = require("util");

const verifySeller = require("../verify/verifySeller");
const verifyItemSeller = require("../verify/verifyItemSeller");

const query = util.promisify(connection.query).bind(connection);

//GET ALL ITEMS
router.get(
  "/allitems/:sellerId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let findQuery =
      "SELECT * FROM item WHERE seller_id = " + req.params.sellerId + ";";
    try {
      connection.query(findQuery, async (err, result) => {
        if (err)
          res
            .status(400)
            .json({ message: "Error in Finding Items", error: true });
        else res.status(200).send(result);
      });
    } catch (error) {
      return res.status(400).json({ message: "Error", error: true });
    }
  }
);

//ADD ITEM
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  verifySeller,
  async (req, res) => {
    const { item_name, quantity, unit_price } = req.body;
    let insertQuery;
    insertQuery =
      "INSERT INTO item VALUES(DEFAULT," +
      req.user.seller_id +
      ",'" +
      item_name +
      "'," +
      quantity +
      "," +
      unit_price +
      ");";
    try {
      connection.query(insertQuery, async (err, result) => {
        if (err)
          res
            .status(400)
            .json({ message: "Error in adding Item", error: true });
        else
          res
            .status(200)
            .json({ message: "Item Added Successfully", error: false });
      });
    } catch (error) {
      return res.status(400).json({ message: "Error", error: true });
    }
  }
);

//DELETE ITEM
router.delete(
  "/delete/:item_id",
  passport.authenticate("jwt", { session: false }),
  verifySeller,
  verifyItemSeller,
  async (req, res) => {
    try {
      let deleteQuery =
        "DELETE FROM item WHERE item_id =" + parseInt(req.params.item_id) + ";";
      connection.query(deleteQuery, async (err, result) => {
        if (err)
          res
            .status(400)
            .json({ message: "Error in deleting Item", error: true });
        else
          res
            .status(200)
            .json({ message: "Item Deleted Successfully", error: false });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error", error: true });
    }
  }
);

//MODIFY ITEM QUANTITY
router.post(
  "/modify/:item_id",
  passport.authenticate("jwt", { session: false }),
  verifySeller,
  verifyItemSeller,
  async (req, res) => {
    try {
      let updateQuery =
        "UPDATE item SET quantity = quantity + " +
        req.body.addQuantity +
        " WHERE item_id= " +
        req.params.item_id +
        ";";

      connection.query(updateQuery, async (err, result) => {
        if (err)
          res.status(400).json({
            message: "Error in Modifying Quantity of Item",
            error: true,
          });
        else
          res.status(200).json({
            message: "Item Quantity Modified Successfully",
            error: false,
          });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Error", error: true });
    }
  }
);

module.exports = router;
