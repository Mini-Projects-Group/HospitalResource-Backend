const express = require("express");
const mysql = require("mysql");
const port = process.env.PORT || 5000;

const connection = mysql.createConnection({
  host: "remotemysql.com",
  user: "i6jutPzvvw",
  password: "6jkCzjiLmG",
  database: "i6jutPzvvw",
  port: "3306",
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

app.get("/", (req, res) => {
  res.send("Hello World! 2");
});



app.listen(port, () => console.log(`App listening on port ${port}...`));
