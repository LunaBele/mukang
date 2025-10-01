import { requireOrInstall } from "./utils/requireOrInstall";

// Auto-install needed packages
const express = requireOrInstall("express") as typeof import("express");
const axios = requireOrInstall("axios") as typeof import("axios");
const cheerio = requireOrInstall("cheerio") as typeof import("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

// HTML frontend
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Plants vs Brainrots Tracker</title>
      <style>
        body { font-family: sans-serif; padding: 2rem; background: #f9fafb; }
        button { padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer; }
        pre { background: #111; color: #0f0; padding: 1rem; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>🌱 Plants vs Brainrots Stock Tracker</h1>
      <button id="fetchBtn">Fetch Stock</button>
      <pre id="output">Click the button to fetch stock...</pre>

      <script>
        document.getElementById("fetchBtn").addEventListener("click", async () => {
          const res = await fetch("/stock");
          const data = await res.json();
          document.getElementById("output").textContent = JSON.stringify(data, null, 2);
        });
      </script>
    </body>
    </html>
  `);
});

// JSON REST endpoint
app.get("/stock", async (req, res) => {
  try {
    const { data } = await axios.get("https://plantsvsbrainrotsstocktracker.com");
    const $ = cheerio.load(data);
    
    const stock: Array < { name: string;rarity: string;lastSeen: string } > = [];
    
    // Adjust these selectors to the site’s real DOM
    $(".stock-item").each((i, el) => {
      stock.push({
        name: $(el).find(".seed-name").text().trim(),
        rarity: $(el).find(".seed-rarity").text().trim(),
        lastSeen: $(el).find(".last-seen").text().trim(),
      });
    });
    
    res.json({
      success: true,
      updated: new Date().toISOString(),
      items: stock,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});