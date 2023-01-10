//dependencies
const express = require('express');
const mysql = require('mysql2');


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: "mysqlpass20",
    database: 'employeetracker_db'
  },
  console.log(`Connected to the employeetracker_db database.`)
);

db.connect(function(err) {
  if (err){
   throw err;
  }
  console.log("Connected!");
});