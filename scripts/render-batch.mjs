import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const presets = [
  {
    id: "cyber-grid-cyan-blue-4k",
    filename: "cyber_grid_cyan_blue_loop_4k.mp4",
  },
  {
    id: "cyber-grid-gold-luxury-4k",
    filename: "cyber_grid_gold_luxury_loop_4k.mp4",
  },
  {
    id: "cyber-grid-matrix-green-4k",
    filename: "cyber_grid_matrix_green_loop_4k.mp4",
  },
  {
    id: "cyber-grid-synthwave-magenta-4k",
    filename: "cyber_grid_synthwave_magenta_loop_4k.mp4",
  },
];

const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Starting Batch Render of ${presets.length} 4K Stock Assets...`);

for (let i = 0; i < presets.length; i++) {
  const p = presets[i];
  const target = path.join(outDir, p.filename);
  console.log(`\n[${i + 1}/${presets.length}] Rendering: ${p.id} -> ${p.filename}...`);

  try {
    execSync(`npx remotion render ${p.id} "${target}"`, {
      stdio: "inherit",
    });
    console.log(`Done: ${p.filename}`);
  } catch (err) {
    console.error(`Failed to render ${p.id}:`, err);
  }
}

// Generate companion CSV
console.log("\nGenerating companion Adobe Stock CSV...");
execSync("node scripts/generate-csv.mjs", { stdio: "inherit" });
console.log("Batch production complete! All files ready in ./out");
