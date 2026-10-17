import fs from "fs";
import path from "path";

// Adobe Stock Contributor CSV columns: Filename, Title, Keywords, Category
const presets = [
  {
    filename: "cyber_grid_cyan_blue_loop_4k.mp4",
    title: "Abstract Blue Cyber Technology Network Grid Seamless Loop 4K",
    keywords:
      "seamless loop, abstract background, cyber grid, data network, technology, blue, glowing, futuristic, 4k, ultra hd, motion graphics, copy space, digital floor, cyberspace, internet, perspective, neon",
    category: 15,
  },
  {
    filename: "cyber_grid_gold_luxury_loop_4k.mp4",
    title: "Abstract Gold Cyber Luxury Grid Background Seamless Loop 4K",
    keywords:
      "seamless loop, abstract background, gold grid, luxury, technology, yellow, glowing, futuristic, 4k, ultra hd, motion graphics, wealth, finance, fintech, crypto, perspective, elegant, dark mode",
    category: 15,
  },
  {
    filename: "cyber_grid_matrix_green_loop_4k.mp4",
    title: "Cyber Security Matrix Green Grid Network Seamless Loop 4K",
    keywords:
      "seamless loop, cyber security, matrix green, abstract background, technology, glowing grid, coding, programming, hacker, digital network, 4k, ultra hd, motion graphics, cyberspace, data stream",
    category: 15,
  },
  {
    filename: "cyber_grid_synthwave_magenta_loop_4k.mp4",
    title: "Synthwave Retro 80s Cyber Neon Grid Seamless Loop 4K",
    keywords:
      "seamless loop, synthwave, retrowave, neon grid, magenta, purple, 80s background, futuristic, cyber, motion graphics, 4k, ultra hd, glowing, arcade, electronic music backdrop, copy space",
    category: 15,
  },
];

const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const csvHeader = "Filename,Title,Keywords,Category\n";
const csvRows = presets
  .map(
    (p) =>
      `"${p.filename}","${p.title.replace(/"/g, '""')}","${p.keywords.replace(
        /"/g,
        '""'
      )}",${p.category}`
  )
  .join("\n");

const outputPath = path.join(outDir, "adobe_stock_metadata.csv");
fs.writeFileSync(outputPath, csvHeader + csvRows, "utf-8");

console.log(`\n========================================`);
console.log(`Adobe Stock CSV Successfully Generated!`);
console.log(`File saved to: ${outputPath}`);
console.log(`========================================\n`);
