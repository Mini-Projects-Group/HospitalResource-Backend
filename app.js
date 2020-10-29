const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");

const strategy = require("./strategy/auth");

const mysql = require("mysql");
const port = process.env.PORT || 5000;

const connection = require("./db/connection");

// ROUTES
const authRoute = require("./routes/auth");
const itemRoute = require("./routes/items");
const orderRoute = require("./routes/orders");
const passport = require("passport");

const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/api/auth", authRoute);
app.use("/api/item", itemRoute);
app.use("/api/orders", orderRoute);

app.get("/", (req, res) => {
  res.send("API for DBMS");
});

app.listen(port, () => console.log(`App listening on port ${port}...`));
