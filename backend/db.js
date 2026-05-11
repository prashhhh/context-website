/** @format */

// /** @format */

// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Pzpz.y@123",
//   database: "contextdb",
// });

// db.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("MySQL Connected");
//   }
// });

// module.exports = db;

// Newone which claude given

/** @format */
require("dotenv").config();
const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pzpz.y@123",
  database: "contextdb",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database");

  // Create the posts table if it doesn't exist
  const createTable = `
    CREATE TABLE IF NOT EXISTS posts (
      id        VARCHAR(36)  PRIMARY KEY,
      name      VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
      text      TEXT         NOT NULL,
      likes     INT          NOT NULL DEFAULT 0,
      createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTable, (err) => {
    if (err) console.error("❌ Failed to create table:", err.message);
    else console.log("✅ Posts table ready");
  });
});

module.exports = db;
