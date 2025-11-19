// index.js
const express = require("express");
const { nanoid } = require("nanoid");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Use BASE_URL from environment or fallback to localhost
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// In-memory store for URLs (use a database for production)
const urlDatabase = {};

// POST /shorten - create a short URL
app.post("/shorten", (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "Please provide a URL" });
  }

  const urlCode = nanoid(6); // short 6-character code
  urlDatabase[urlCode] = longUrl;

  const shortUrl = `${BASE_URL}/${urlCode}`;
  res.json({ shortUrl });
});

// GET /:code - redirect to the original URL
app.get("/:code", (req, res) => {
  const longUrl = urlDatabase[req.params.code];

  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send("URL not found");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
