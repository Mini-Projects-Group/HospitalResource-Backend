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

  connection.connect(function (err) {
    if (err) throw err;

    // HOSPITAL USER
    const hospital_user_sql =
      "CREATE TABLE IF NOT EXISTS hospital(hospital_id INT PRIMARY KEY AUTO_INCREMENT,hospital_name VARCHAR(255) NOT NULL,email_id VARCHAR(50) NOT NULL UNIQUE,password VARCHAR(100) NOT NULL,address VARCHAR(255) NOT NULL,contact_no BIGINT NOT NULL,type VARCHAR(255) DEFAULT 'hospital');";
    connection.query(hospital_user_sql, (error, result) => {
      if (error) throw error;
      console.log("Hospital User Table created");
    });
    // SELLER USER
    const seller_user_sql =
      "CREATE TABLE IF NOT EXISTS seller(seller_id INT PRIMARY KEY AUTO_INCREMENT,shop_name VARCHAR(255) NOT NULL UNIQUE, seller_name VARCHAR(255) NOT NULL, email_id VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL, address VARCHAR(255) NOT NULL,contact_no BIGINT NOT NULL,type VARCHAR(255) DEFAULT 'seller');";
    connection.query(seller_user_sql, (error, result) => {
      if (error) throw error;
      console.log("Seller User Table Created");
    });

    // ITEM
    const item_sql =
      " CREATE TABLE IF NOT EXISTS item( item_id INT NOT NULL AUTO_INCREMENT, seller_id INT NOT NULL, item_name VARCHAR(255), quantity INT, unit_price FLOAT, PRIMARY KEY(item_id), FOREIGN KEY (seller_id) REFERENCES seller(seller_id) ON DELETE CASCADE ON UPDATE CASCADE );";
    connection.query(item_sql, (error, result) => {
      if (error) throw error;
      console.log("Item Table created");
    });

    // ORDERS TABLE
    const orders_sql =
      "CREATE TABLE IF NOT EXISTS orders(order_id INT PRIMARY KEY AUTO_INCREMENT, seller_id INT NOT NULL, hospital_id INT NOT NULL, items JSON , status VARCHAR(10) ,date_order DATE, date_delivery DATE, FOREIGN KEY (seller_id) REFERENCES seller(seller_id) ON DELETE CASCADE ON UPDATE CASCADE,FOREIGN KEY (hospital_id) REFERENCES hospital(hospital_id) ON DELETE CASCADE ON UPDATE CASCADE);";

    connection.query(orders_sql, (error, result) => {
      if (error) throw error;

      console.log("Orders table created");
    });

    console.log("Connected to db");
  });

  connection.on("error", (err) => {
    console.log("Error");
    if (err.code === "PROTOCOL_CONNECTION_LOST") handleDisconnect();
    else throw err;
  });
};

handleDisconnect();

module.exports = connection;
