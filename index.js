const express = require('express');
const { nanoid } = require('nanoid');
const app = express();
const PORT = 3000;

app.use(express.json()); // MUST stay, it parses JSON

const urls = {}; // temporary storage

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to TinyLink!');
});

// Shorten URL route
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: 'Please provide a URL' });

  const shortId = nanoid(6);
  urls[shortId] = { longUrl, clicks: 0 };
  res.json({ shortUrl: `http://localhost:3000/${shortId}` });
});

// Redirect route
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const urlData = urls[shortId];
  if (urlData) {
    urlData.clicks++;
    res.redirect(urlData.longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
