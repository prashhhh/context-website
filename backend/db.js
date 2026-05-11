/** @format */

require("dotenv").config();
const mysql = require("mysql2");

let db;

// Use full URL if provided, otherwise use individual vars
if (process.env.MYSQL_URL) {
  console.log("Connecting via MYSQL_URL...");
  db = mysql.createConnection(process.env.MYSQL_URL);
} else {
  console.log("DB Config:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? "SET" : "NOT SET",
  });
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

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
