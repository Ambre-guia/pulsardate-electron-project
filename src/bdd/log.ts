const mysql = require("mysql2");

module.exports = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3308,
  database: "pulsardate",
});
