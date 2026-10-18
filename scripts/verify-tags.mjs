import fs from "fs";
import path from "path";

const targetPath = process.argv[2] || "out/adobe_stock_metadata.csv";
const content = fs.readFileSync(targetPath, "utf-8").trim();
const lines = content.split("\n").slice(1);

console.log(`Inspecting CSV: ${targetPath}`);
console.log(`Total rows in CSV: ${lines.length}`);

let hasErrors = false;

lines.forEach((line, index) => {
  const match = line.match(/^"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*(\d+)$/);
  if (!match) {
    console.error(`Row ${index + 1} did not match regex pattern!`);
    hasErrors = true;
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
    console.error(`  ERROR: Tag count is not 49! (Found ${tags.length} tags, ${uniqueTags.size} unique)`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.error("\nFAIL: Metadata validation encountered errors!");
  process.exit(1);
} else {
  console.log(`\nSUCCESS: ALL ${lines.length} VIDEOS HAVE EXACTLY 49 UNIQUE TAGS AND VALID METADATA!`);
}
