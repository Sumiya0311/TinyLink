const express = require("express");
const bodyParser = require("body-parser");
const { nanoid } = require("nanoid");

const app = express();
app.use(bodyParser.json());

const urlDatabase = {}; // Simple in-memory database

// POST /shorten - create a short URL
app.post("/shorten", (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }

  const urlCode = nanoid(6); // generate short code
  const shortUrl = `${process.env.BASE_URL}/${urlCode}`; // use environment variable

  urlDatabase[urlCode] = longUrl;

  return res.status(200).json({ shortUrl });
});

// GET /:code - redirect to original URL
app.get("/:code", (req, res) => {
  const longUrl = urlDatabase[req.params.code];

  if (!longUrl) {
    return res.status(404).send("URL not found");
  }

  res.redirect(longUrl);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
