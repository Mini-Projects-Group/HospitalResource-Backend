const express = require("express");
const passport = require("passport");
const connection = require("../db/connection");
const util = require("util");

const query = util.promisify(connection.query).bind(connection);

const router = express.Router();

//router.get();

module.exports = router;
