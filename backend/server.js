/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

const CONTEXT_DURATION_MS = 17 * 60 * 1000; // 17 minutes

app.use(
  cors({
    origin: ["http://localhost:5173", /\.vercel\.app$/],
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// GET current active context
app.get("/api/context", (req, res) => {
  db.query(
    "SELECT * FROM posts ORDER BY createdAt DESC LIMIT 1",
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!rows.length)
        return res.json({ context: null, cooldown: false, remainingMs: 0 });

      const post = rows[0];
      const age = Date.now() - new Date(post.createdAt).getTime();
      const active = age < CONTEXT_DURATION_MS;
      const remainingMs = active ? CONTEXT_DURATION_MS - age : 0;

      res.json({
        context: active ? post : null,
        cooldown: active,
        remainingMs,
      });
    },
  );
});

// POST new context (blocked if one is active)
app.post("/api/context", (req, res) => {
  const { name, text } = req.body;
  if (!text || text.trim().length === 0)
    return res.status(400).json({ error: "Text is required" });
  if (text.length > 50000)
    return res.status(400).json({ error: "Too long (max 50,000 chars)" });

  // Check if there's an active context
  db.query(
    "SELECT createdAt FROM posts ORDER BY createdAt DESC LIMIT 1",
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });

      if (rows.length) {
        const age = Date.now() - new Date(rows[0].createdAt).getTime();
        if (age < CONTEXT_DURATION_MS) {
          const remainingMs = CONTEXT_DURATION_MS - age;
          return res.status(429).json({ error: "cooldown", remainingMs });
        }
      }

      const post = {
        id: uuidv4(),
        name: name?.trim() || "Anonymous",
        text: text.trim(),
        likes: 0,
        createdAt: new Date(),
      };

      db.query("INSERT INTO posts SET ?", post, (err) => {
        if (err) return res.status(500).json({ error: "Failed to post" });
        res
          .status(201)
          .json({ context: post, remainingMs: CONTEXT_DURATION_MS });
      });
    },
  );
});

// PUT like
app.put("/api/context/:id/like", (req, res) => {
  const { liked } = req.body;
  db.query(
    "UPDATE posts SET likes = GREATEST(0, likes + ?) WHERE id = ?",
    [liked ? 1 : -1, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!result.affectedRows)
        return res.status(404).json({ error: "Not found" });
      db.query(
        "SELECT * FROM posts WHERE id = ?",
        [req.params.id],
        (err, rows) => {
          res.json(rows[0]);
        },
      );
    },
  );
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
