import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const presets = [
  {
    id: "CyberGrid",
    filename: "cyber_grid_blue_4k.mp4",
  },
  {
    id: "GoldParticles",
    filename: "gold_particles_awards_bokeh_4k.mp4",
  },
  {
    id: "SoftGradientLoop",
    filename: "soft_gradient_magenta_blue_cycle_4k.mp4",
  },
  {
    id: "AudioWaveTech",
    filename: "optical_fiber_audio_wave_tech_4k.mp4",
  },
  {
    id: "NeonArrowsTunnel",
    filename: "neon_arrows_tunnel_4k.mp4",
  },
  {
    id: "HyperspaceWarp",
    filename: "hyperspace_lightspeed_tunnel_4k.mp4",
  },
];

const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Starting Batch Render of ${presets.length} Master 4K Stock Assets...`);

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
console.log("All assets and metadata CSV ready in ./out");
