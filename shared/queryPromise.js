const util = require('util');
const connection = require('../db/connection');

module.exports = util.promisify(connection.query).bind(connection);
