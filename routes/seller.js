const express = require("express");
const passport = require("passport");
const connection = require("../db/connection");

const util = require("util");
const verifyHospital = require("../verify/verifyHospital");
const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Seller API");
});

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  verifyHospital,
  (req, res) => {
    let query =
      "SELECT seller_id,email_id, shop_name, seller_name, address FROM seller";

    try {
      connection.query(query, async (error, result) => {
        if (error) {
          console.log(error);
          res
            .status(400)
            .json({ message: "Error in getting sellers", error: true });
        } else res.status(200).send(result);
      });
    } catch (err) {
      return res.json({
        error: true,
        message: "Error Occured",
      });
    }
  }
);

module.exports = router;
