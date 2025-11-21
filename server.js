const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const { nanoid } = require("nanoid");
require("dotenv").config();

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Create short URL
app.post("/shorten", async (req, res) => {
  const { original_url } = req.body;

  if (!original_url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const short_code = nanoid(6);

  const { data, error } = await supabase
    .from("links")
    .insert([{ original_url, short_code }]);

  if (error) return res.status(500).json({ error });

  res.json({
    short_url: `http://localhost:${process.env.PORT}/${short_code}`,
    short_code,
  });
});

// Redirect
app.get("/:code", async (req, res) => {
  const { code } = req.params;

  const { data } = await supabase
    .from("links")
    .select("original_url")
    .eq("short_code", code)
    .single();

  if (!data) return res.status(404).send("Short URL not found");

  res.redirect(data.original_url);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
