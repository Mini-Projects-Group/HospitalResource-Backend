const express = require("express");
const passport = require("passport");
const connection = require("../db/connection");
const util = require("util");
const verifySellerApprovingOrder = require("../verify/verifySellerApprovingOrder");
const query = require("../shared/queryPromise");
const verifySeller = require("../verify/verifySeller");

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Orders api");
});

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { seller_id, hospital_id, items } = req.body;
    console.log(req.user);
    const status = "pending"; // status will be pending by default

    let insertQuery =
      "INSERT INTO orders VALUES(NULL," +
      req.body.seller_id +
      "," +
      hospital_id +
      ", '" +
      JSON.stringify(items) + // array of items
      "' , '" +
      status +
      "', CURDATE() , NULL" + // date of order
      " );";

    try {
      connection.query(insertQuery, async (error, result) => {
        if (error) {
          console.log(error);
          res
            .status(400)
            .json({ message: "Error in placing error", error: true });
        } else
          res
            .status(200)
            .json({ message: "Order placed successfully!!", error: false });
      });
    } catch (error) {
      return res.status(400).json({ message: "Error", error: true });
    }
  }
);

router.delete(
  "/:order_id",
  passport.authenticate("jwt", { session: false }),
  verifySellerApprovingOrder,
  async (req, res) => {
    try {
      let user_id = req.user.seller_id;
      let order_id = req.params.order_id;

      let current_order_delete_query = `DELETE FROM orders WHERE order_id=${order_id} AND seller_id=${user_id};`;
      let result = await query(current_order_delete_query);
      return res.json({
        error: false,
        message: "Deleted",
      });
    } catch (e) {
      return res.json({
        error: true,
        message: "Error Occured",
      });
    }
  }
);

// Special Route for Seller to get Orders Related to him

router.get(
  "/allOrders",
  passport.authenticate("jwt", { session: false }),
  verifySeller,
  async (req, res) => {
    try {
      let order_seller_query = `SELECT * FROM orders NATURAL JOIN hospital WHERE seller_id = ${req.user.seller_id};`;
      let result = await query(order_seller_query);
      res.send(result);
    } catch (e) {
      return res.json({
        error: true,
        message: "Error Occured",
      });
    }
  }
);

module.exports = router;
