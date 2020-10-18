const mysql = require("mysql");
const express = require("express");

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
  });
  
  connection.connect(function (err) {
    if (err) throw err;
    // HOSPITAL USER
    const hospital_user_sql = "CREATE TABLE IF NOT EXISTS hospital(hospital_id INT PRIMARY KEY AUTO_INCREMENT,hospital_name VARCHAR(255) NOT NULL,email_id VARCHAR(50) NOT NULL UNIQUE,password VARCHAR(100) NOT NULL,address VARCHAR(255) NOT NULL,contact_no BIGINT NOT NULL,type VARCHAR(255) DEFAULT 'hospital');";
    connection.query(hospital_user_sql, (error, result) => {
      if (error) throw error;
      console.log("Hospital User Table created");
    });
    // SELLER USER
    const seller_user_sql = "CREATE TABLE IF NOT EXISTS seller(seller_id INT PRIMARY KEY AUTO_INCREMENT,shop_name VARCHAR(255) NOT NULL UNIQUE, seller_name VARCHAR(255) NOT NULL, email_id VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL, address VARCHAR(255) NOT NULL,contact_no BIGINT NOT NULL,type VARCHAR(255) DEFAULT 'seller');"
    connection.query(seller_user_sql, ( error, result) => {
      if(error) throw error;
      console.log("Seller User Table Created");
    });
  
    console.log("Connected to db");
  });

module.exports = connection;