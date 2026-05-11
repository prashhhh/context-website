/** @format */

require("dotenv").config();
const mysql = require("mysql2");

console.log("MYSQL_URL present:", !!process.env.MYSQL_URL);

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.code, err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database");

  db.query(
    `
    CREATE TABLE IF NOT EXISTS posts (
      id        VARCHAR(36)  PRIMARY KEY,
      name      VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
      text      MEDIUMTEXT   NOT NULL,
      likes     INT          NOT NULL DEFAULT 0,
      createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("❌ Table creation failed:", err.message);
      else console.log("✅ Posts table ready");
    },
  );
});

module.exports = db;
