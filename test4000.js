const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Port 4000 is working!");
});

app.listen(4000, () => console.log("Server running on port 4000"));
