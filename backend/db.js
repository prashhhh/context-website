/** @format */

require("dotenv").config();
const mysql = require("mysql2");

function createConnection() {
  const db = mysql.createConnection(process.env.MYSQL_URL);

  db.connect((err) => {
    if (err) {
      console.error("❌ MySQL connection failed:", err.code, err.message);
      // Retry after 3 seconds
      setTimeout(createConnection, 3000);
      return;
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

  db.on("error", (err) => {
    console.error("❌ DB error:", err.code);
    if (
      err.code === "PROTOCOL_CONNECTION_LOST" ||
      err.code === "ECONNRESET" ||
      err.code === "ETIMEDOUT"
    ) {
      console.log("🔄 Reconnecting to MySQL...");
      createConnection();
    } else {
      throw err;
    }
  });

  return db;
}

const db = createConnection();
module.exports = db;
