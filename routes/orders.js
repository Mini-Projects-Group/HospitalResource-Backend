const express = require("express");
const passport = require("passport");
const connection = require("../db/connection");
const util = require("util");

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Orders api");
});

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { seller_id,hospital_id, items } = req.body;
    console.log(req.user);
    const status = "pending"; // status will be pending by default

    let insertQuery =
      "INSERT INTO orders VALUES(NULL," +
      req.body.seller_id +
      "," +
      req.user.hospital_id +
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

module.exports = router;
