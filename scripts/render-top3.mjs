import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const targetComps = [
  { id: "SoftGradientLoop", filename: "soft_gradient_magenta_blue_cycle_4k.mp4" },
  { id: "NeonLowPolyMesh", filename: "neon_low_poly_communication_mesh_4k.mp4" },
  { id: "BlueNeonStripes", filename: "blue_neon_glowing_stripes_motion_4k.mp4" },
];

const outDir = path.resolve("./out");
const batch01Dir = path.join(outDir, "batch_01");

if (!fs.existsSync(batch01Dir)) {
  fs.mkdirSync(batch01Dir, { recursive: true });
}

console.log("==========================================================");
console.log("RENDERING 3 ENHANCED BROADCAST 4K UHD VIDEOS VIA REMOTION");
console.log("==========================================================");

for (let i = 0; i < targetComps.length; i++) {
  const item = targetComps[i];
  const batchFilePath = path.join(batch01Dir, item.filename);
  const rootFilePath = path.join(outDir, item.filename);

  console.log(`\n[${i + 1}/${targetComps.length}] Rendering: ${item.id} -> ${item.filename}`);

  try {
    // Render directly into batch_01
    execSync(`npx remotion render ${item.id} "${batchFilePath}"`, {
      stdio: "inherit",
    });
    // Also copy to root out/ for easy direct access
    fs.copyFileSync(batchFilePath, rootFilePath);
    console.log(`Successfully rendered: ${item.filename} (saved to batch_01/ and out/)`);
  } catch (err) {
    console.error(`Error rendering ${item.id}:`, err);
    process.exit(1);
  }
}

// Regenerate companion CSV metadata in batch_01
console.log("\nUpdating companion CSV metadata with 49 tags in batch_01...");
execSync(`node scripts/generate-csv.mjs "${batch01Dir}"`, { stdio: "inherit" });

console.log("\nALL 3 VIDEOS SUCCESSFULLY GENERATED IN 4K UHD!");
