import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const presets = [
  // 1. Strong Rain at Night (URL 197058599)
  {
    id: "StrongRainNight",
    filename: "strong_rain_at_night_cinematic_4k.mp4",
  },
  // 2. Abstract Glowing Neon Arrows (URL 381536144)
  {
    id: "NeonArrowsTunnel",
    filename: "abstract_glowing_neon_arrows_loop_4k.mp4",
  },
  // 3. 4K Abstract Swirls (URL 220530931)
  {
    id: "AbstractSwirls4K",
    filename: "abstract_chromatic_swirls_flow_4k.mp4",
  },
];

const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Starting Batch Render of ${presets.length} New 4K UHD Stock Videos...`);

for (let i = 0; i < presets.length; i++) {
  const p = presets[i];
  const target = path.join(outDir, p.filename);
  console.log(`\n[${i + 1}/${presets.length}] Rendering: ${p.id} -> ${p.filename}...`);

  try {
    execSync(`npx remotion render ${p.id} "${target}"`, {
      stdio: "inherit",
    });
    console.log(`Successfully rendered: ${p.filename}`);
  } catch (err) {
    console.error(`Failed to render ${p.id}:`, err);
  }
}

// Generate companion CSV
console.log("\nGenerating companion Adobe Stock CSV...");
execSync("node scripts/generate-csv.mjs", { stdio: "inherit" });
console.log("\nAll requested 4K UHD videos and metadata CSV ready in ./out");
