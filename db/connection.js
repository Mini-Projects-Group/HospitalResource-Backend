const mysql = require("mysql");
const express = require("express");

let connection;

const handleDisconnect = () => {
  connection = mysql.createConnection({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
  });

  //Type table
  const type_sql =
    "CREATE TABLE IF NOT EXISTS type(type_id INT PRIMARY KEY AUTO_INCREMENT, type VARCHAR(255));";
  connection.query(type_sql, (error, result) => {
    if (error) throw error;
    console.log("Type table created");
    // let insertQuery;
    // insertQuery ="INSERT INTO type VALUES(1,'hospital'),(2,'seller');";
    // connection.query(insertQuery, async (err, result) => {
    //     if (err) {
    //       console.log(err);
    //     }
    // });
  });

  // Credenetial table
  const credentials_sql =
    "CREATE TABLE IF NOT EXISTS credential(credential_id INT PRIMARY KEY AUTO_INCREMENT,email_id VARCHAR(50) NOT NULL UNIQUE,password VARCHAR(100) NOT NULL,address VARCHAR(255) NOT NULL,contact_no BIGINT NOT NULL,type_id INT, FOREIGN KEY(type_id) REFERENCES type(type_id) ON DELETE CASCADE ON UPDATE CASCADE);";
  connection.query(credentials_sql, (error, result) => {
    if (error) throw error;
    console.log("Credential table created");
  });

  // HOSPITAL USER
  const hospital_user_sql =
    "CREATE TABLE IF NOT EXISTS hospital(hospital_id INT PRIMARY KEY AUTO_INCREMENT,hospital_name VARCHAR(255) NOT NULL,credential_id INT,FOREIGN KEY(credential_id) REFERENCES credential(credential_id) ON DELETE CASCADE ON UPDATE CASCADE);";
  connection.query(hospital_user_sql, (error, result) => {
    if (error) throw error;
    console.log("Hospital User Table created");
  });
  // SELLER USER
  const seller_user_sql =
    "CREATE TABLE IF NOT EXISTS seller(seller_id INT PRIMARY KEY AUTO_INCREMENT,shop_name VARCHAR(255) NOT NULL UNIQUE, seller_name VARCHAR(255) NOT NULL, credential_id INT,FOREIGN KEY(credential_id) REFERENCES credential(credential_id) ON DELETE CASCADE ON UPDATE CASCADE);";
  connection.query(seller_user_sql, (error, result) => {
    if (error) throw error;
    console.log("Seller User Table Created");
  });

  // ITEM NAME
  const item_name_sql =
    "CREATE TABLE IF NOT EXISTS itemname(item_name_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,item_name VARCHAR(255));";
  connection.query(item_name_sql, (error, result) => {
    if (error) throw error;
    console.log("Item Name Table created");
  });

  // ITEM
  const item_sql =
    "CREATE TABLE IF NOT EXISTS item(item_id INT NOT NULL AUTO_INCREMENT, seller_id INT NOT NULL, item_name_id INT , quantity INT, unit_price FLOAT, PRIMARY KEY(item_id), FOREIGN KEY (seller_id) REFERENCES seller(seller_id) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (item_name_id) REFERENCES itemname(item_name_id) ON DELETE CASCADE ON UPDATE CASCADE );";
  connection.query(item_sql, (error, result) => {
    if (error) throw error;
    console.log("Item Table created");
  });

  // ORDERS TABLE
  let orders_sql =
    "CREATE TABLE IF NOT EXISTS orders(order_id INT PRIMARY KEY AUTO_INCREMENT, seller_id INT NOT NULL, hospital_id INT NOT NULL, items JSON ,status_id INT,date_order DATE, date_delivery DATE, FOREIGN KEY (seller_id) REFERENCES seller(seller_id) ON DELETE CASCADE ON UPDATE CASCADE,FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id) ON DELETE CASCADE ON UPDATE CASCADE,FOREIGN KEY(status_id) REFERENCES status(status_id) ON DELETE CASCADE ON UPDATE CASCADE);";

  connection.query(orders_sql, (error, result) => {
    if (error) throw error;
    console.log("Orders table created");
    console.log("Connected to db");
  });

  // HOSPITAL STOCK
  const hospital_stock_sql =
    "CREATE TABLE IF NOT EXISTS hospital_stock(stock_id INT PRIMARY KEY AUTO_INCREMENT ,hospital_id INT NOT NULL, items JSON, items_used JSON ,FOREIGN KEY(hospital_id) REFERENCES hospital(hospital_id) ON DELETE CASCADE ON UPDATE CASCADE)";

  connection.query(hospital_stock_sql, (error, result) => {
    if (error) throw error;
    console.log("Hospital Stock Table created.");
  });

  connection.on("error", (err) => {
    console.log("Error");
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET")
      handleDisconnect();
    else throw err;
  });
};

handleDisconnect();

module.exports = connection;
