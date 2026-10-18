import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Define compositions to render in Batch 04
const presets = [
  { id: "OrionNebulaFlythrough", filename: "flying_through_orion_nebula_deep_space_4k.mp4" },
  { id: "OrangeJuiceExplosion", filename: "explosion_orange_juice_slow_motion_splash_4k.mp4" },
  { id: "RedBlueParticleRing", filename: "red_blue_particles_energy_circle_ring_intro_4k.mp4" },
  { id: "ColoredInkSplash", filename: "splash_colored_ink_burst_slow_motion_4k.mp4" },
  { id: "PlasmaRing3D", filename: "plasma_ring_energy_toroid_solar_flare_3d_4k.mp4" },
];

const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Automatically detect the next batch folder name (e.g. batch_01, batch_02, ...)
const existingBatches = fs
  .readdirSync(outDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^batch_\d+$/.test(d.name))
  .map((d) => parseInt(d.name.replace("batch_", ""), 10));

const nextBatchNum = existingBatches.length > 0 ? Math.max(...existingBatches) + 1 : 1;
const batchFolderName = `batch_${String(nextBatchNum).padStart(2, "0")}`;
const batchDir = path.join(outDir, batchFolderName);

if (presets.length === 0) {
  console.log(`Current batch directory is ready: ${batchFolderName}`);
  console.log("Add compositions to the presets array in scripts/render-batch.mjs to render next batch.");
  process.exit(0);
}

fs.mkdirSync(batchDir, { recursive: true });

console.log(`Starting Batch Render into ${batchFolderName} (${presets.length} 4K UHD Videos)...`);

for (let i = 0; i < presets.length; i++) {
  const p = presets[i];
  const target = path.join(batchDir, p.filename);
  console.log(`\n[${i + 1}/${presets.length}] Rendering: ${p.id} -> ${batchFolderName}/${p.filename}...`);

  try {
    execSync(`npx remotion render ${p.id} "${target}"`, {
      stdio: "inherit",
    });
    console.log(`Successfully rendered: ${p.filename}`);
  } catch (err) {
    console.error(`Failed to render ${p.id}:`, err);
  }
}

// Generate companion CSV inside the specific batch folder
console.log(`\nGenerating companion Adobe Stock CSV for ${batchFolderName}...`);
execSync(`node scripts/generate-csv.mjs "${batchDir}"`, { stdio: "inherit" });
console.log(`\nAll batch videos and metadata CSV ready in ${batchDir}`);
