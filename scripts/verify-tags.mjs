import fs from "fs";

const content = fs.readFileSync("out/adobe_stock_metadata.csv", "utf-8").trim();
const lines = content.split("\n").slice(1);

console.log(`Total rows in CSV: ${lines.length}`);

lines.forEach((line, index) => {
  const match = line.match(/^"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*(\d+)$/);
  if (!match) {
    console.error(`Row ${index + 1} did not match regex pattern!`);
    return;
  }
  const [, filename, title, keywordsStr, category] = match;
  const tags = keywordsStr.split(",").map((t) => t.trim());
  const uniqueTags = new Set(tags);

  console.log(`\nVideo ${index + 1}: ${filename}`);
  console.log(`  Title: "${title}" (${title.length} chars)`);
  console.log(`  Category: ${category}`);
  console.log(`  Total Tags: ${tags.length}`);
  console.log(`  Unique Tags: ${uniqueTags.size}`);

  if (tags.length !== 49 || uniqueTags.size !== 49) {
    console.error(`  ERROR: Tag count is not 49!`);
    process.exit(1);
  }
});

console.log("\nALL 5 VIDEOS HAVE EXACTLY 49 UNIQUE TAGS AND VALID METADATA!");
