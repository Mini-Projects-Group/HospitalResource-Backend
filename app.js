const express = require("express");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const strategy = require('./strategy/auth');

const mysql = require("mysql");
const port = process.env.PORT || 5000;

// ROUTES
const authRoute = require('./routes/auth');
const passport = require("passport");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

connection.connect(function (err) {
  if (err) throw err;
  const sql = "CREATE TABLE IF NOT EXISTS test(id int) ";

  connection.query(sql, (error, result) => {
    if (error) throw error;
    console.log("Table created");
  });

  console.log("Connected to db");
});
const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use( '/api/auth', authRoute);

app.get("/", (req, res) => {
  const token = jwt.sign({
    "name": "John Doe",
  },process.env.JWT_SECRET);

  res.send(token);
});



app.listen(port, () => console.log(`App listening on port ${port}...`));
