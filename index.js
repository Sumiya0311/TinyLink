const express = require("express");
const shortid = require("shortid");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// In-memory storage for short URLs
// If you want DB version, tell me
const urlDatabase = {};

// Home route (fixes "Cannot GET /") 
app.get("/", (req, res) => {
  res.send(`
    <h1>TinyLink URL Shortener</h1>
    <p>Use POST /shorten to create a short URL.</p>
    <p>Example body:</p>
    <pre>
    {
      "longUrl": "http://google.com"
    }
    </pre>
  `);
});

// Create short URL
app.post("/shorten", (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }

  const shortCode = shortid.generate();
  // urlDatabase[shortCode] = longUrl;
  urlDatabase[shortCode] = {
  longUrl,
  clicks: 0
};


  const shortUrl = `${process.env.BASE_URL || "https://your-render-domain.com"}/${shortCode}`;

  res.json({ shortUrl });
});

// Redirect short URL
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const longUrl = urlDatabase[code];

  if (!longUrl) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(longUrl);
});

// Render uses dynamic ports
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
