const express = require("express");
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const strategy = require('./strategy/auth');

const mysql = require("mysql");
const port = process.env.PORT || 5000;

const connection = require('./db/connection');

// ROUTES
const authRoute = require('./routes/auth');
const passport = require("passport");



const app = express();
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/auth', authRoute);

app.get("/", (req, res) => {
  res.send("API for DBMS");
});



app.listen(port, () => console.log(`App listening on port ${port}...`));
