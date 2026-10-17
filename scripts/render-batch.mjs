import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const presets = [
  {
    id: "SoftGradientLoop",
    filename: "soft_gradient_magenta_blue_cycle_4k.mp4",
  },
  {
    id: "WaterDropletsExplosion",
    filename: "explosion_water_droplets_slow_motion_4k.mp4",
  },
  {
    id: "NeonLowPolyMesh",
    filename: "neon_low_poly_communication_mesh_4k.mp4",
  },
  {
    id: "BlueNeonStripes",
    filename: "blue_neon_glowing_stripes_motion_4k.mp4",
  },
];

const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Starting Batch Render of ${presets.length} Requested 4K Stock Videos...`);

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
console.log("\nAll requested 4K videos and metadata CSV ready in ./out");
