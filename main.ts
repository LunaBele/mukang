import { requireOrInstall } from "./utils/requireOrInstall";

// Auto-install dependencies if missing
const express = requireOrInstall("express") as typeof import("express");
const axios = requireOrInstall("axios") as typeof import("axios");
const cheerio = requireOrInstall("cheerio") as typeof import("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/stock", async (req, res) => {
  try {
    const { data } = await axios.get("https://plantsvsbrainrotsstocktracker.com");
    const $ = cheerio.load(data);
    
    const stock: Array < { name: string;rarity: string;lastSeen: string } > = [];
    
    // Adjust selectors to real site structure
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
    console.error("Error fetching stock:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});