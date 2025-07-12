import express from "express";
import speakeasy from "speakeasy";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/totp", (req, res) => {
  const key = req.query.key;
  if (!key) return res.status(400).json({ error: "Missing key" });

  try {
    const token = speakeasy.totp({
      secret: key,
      encoding: "base32"
    });
    res.json({ totp: token });
  } catch (e) {
    res.status(500).json({ error: "Invalid key" });
  }
});

app.listen(PORT, () => {
  console.log("TOTP server running");
});
