const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcrypt");
const connection = require("../db/connection");
const util = require("util");

const query = util.promisify(connection.query).bind(connection);

// PROTECTED ROUTE
router.get(
  "/hidden",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.json({ msg: "Hidden", user: req.user });
  }
);

// SIGNUP USER
router.post("/signup", async (req, res) => {
  // GET THE USER INFO
  let insertQuery;
  let encryptedPassword = bcrypt.hashSync(req.body.password, 10);

  let type = req.body.type;

  insertQuery =
    "INSERT INTO credential VALUES(DEFAULT,'" +
    req.body.email_id +
    "','" +
    encryptedPassword +
    "','" +
    req.body.address +
    "'," +
    req.body.contact_no;
  insertQuery += type === "hospital" ? ", 1 );" : ", 2 );";

  try {
    connection.query(insertQuery, async (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Duplicate Email", error: true });
      }
      let id = result.insertId;

      if (req.body.type == "hospital") {
        insertQuery =
          "INSERT INTO hospital VALUES(DEFAULT,'" +
          req.body.hospital_name +
          "'," +
          id +
          ");";

        // CREATE THE HOSPITAL STOCK HERE ONLY.
        connection.query(insertQuery, async (err, re) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Error Occured", error: true });
          }
          let createHospitalStock = `INSERT INTO hospital_stock VALUES(DEFAULT,${
            re.insertId
          },${JSON.stringify("[]")},${JSON.stringify("[]")});`;
          let result = await query(createHospitalStock);

          return res.json({
            message: "Hospital Signed Up Successfully",
            error: false,
          });
        });
      } else {
        insertQuery =
          "INSERT INTO seller VALUES(DEFAULT,'" +
          req.body.shop_name +
          "','" +
          req.body.seller_name +
          "'," +
          id +
          ");";
        connection.query(insertQuery, async (err, re) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Error Occured", error: true });
          }

          return res.json({
            message: "Seller Signed Up Successfully",
            error: false,
          });
        });
      }
    });
  } catch (e) {
    console.log("Error Occured While inserting user ");
    return res.json({ message: "Error", error: true });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  console.log('Hello');
  try {
  // TYPE
  console.log(req.body);
  let result;
  if (req.body.type.toLowerCase() == "hospital") {
    result = await query(
      "SELECT * FROM hospital NATURAL JOIN (credential NATURAL JOIN type) WHERE email_id='" +
        req.body.email_id +
        "';"
    );
  } else {
    result = await query(
      "SELECT * FROM seller NATURAL JOIN (credential NATURAL JOIN type) WHERE email_id='" +
        req.body.email_id +
        "';"
    );
  }
  if (result.length == 0) {
    res.status(404);
    return res.json({ message: "Not Registered", error: true, token: null });
  } else {
    let r = await bcrypt.compareSync(req.body.password, result[0].password);
    if (r) {
      let token = jwt.sign(JSON.stringify(result[0]), process.env.JWT_SECRET);
      res.status(200);
      return res.json({ message: "Logged In", error: null, token: token });
    } else {
      res.status(200);
      return res.json({
        message: "Incorrect Password",
        error: true,
        token: null,
      });
    }
  }
  } catch(e) {
    console.log(e);
    return res.json({
      message: "Internal Server Error",
      error: true,
      token: null
    })
  }
});

module.exports = router;
