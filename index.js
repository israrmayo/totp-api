const express = require("express");
const app = express();
const cors = require("cors");
const otplib = require("otplib");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("TOTP server running");
});

app.get("/totp", (req, res) => {
  const key = req.query.key;
  if (!key) return res.status(400).send("Missing key");
  const code = otplib.authenticator.generate(key);
  res.json({ totp: code });
});

app.post("/batch-totp", (req, res) => {
  const keys = req.body.keys;
  if (!Array.isArray(keys)) return res.status(400).json({ error: "Invalid keys" });

  const result = {};
  keys.forEach(key => {
    try {
      result[key] = otplib.authenticator.generate(key);
    } catch (e) {
      result[key] = "ERROR";
    }
  });

  res.json(result);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
