import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Define compositions to render in Batch 05
const presets = [
  { id: "AbstractFireLoop", filename: "full_frame_abstract_fire_slow_motion_loop_4k.mp4" },
  { id: "RisingSmokeFog", filename: "rising_smoke_fog_clouds_overlay_loop_4k.mp4" },
  { id: "OpticalFiberParticles", filename: "optical_fiber_cable_blue_purple_particles_4k.mp4" },
  { id: "DarkLiquidRipples", filename: "dark_liquid_concentric_ripples_abstract_surface_4k.mp4" },
  { id: "TornPaperGreenScreen", filename: "stop_motion_torn_paper_rip_transition_green_screen_4k.mp4" },
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
