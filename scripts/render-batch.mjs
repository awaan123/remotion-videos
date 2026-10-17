import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const presets = [
  // 1. Rainbow Colored Ink in Water (URL 327663872)
  {
    id: "RainbowInkInWater",
    filename: "rainbow_colored_ink_in_water_dispersion_4k.mp4",
  },
  // 2. Neon Dots Spiral Tunnel with Metal Floor (URL 302044677)
  {
    id: "NeonDotsSpiralTunnel",
    filename: "neon_dots_spiral_tunnel_metal_floor_4k.mp4",
  },
  // 3. Underwater Slow Motion Bubbles in Turquoise Pool (URL 384830287)
  {
    id: "UnderwaterBubblesTurquoise",
    filename: "underwater_bubbles_turquoise_pool_4k.mp4",
  },
  // 4. Fire Embers & Sparks Flying in Wind (URL 355415262)
  {
    id: "FireEmbersWind",
    filename: "particles_flying_in_wind_fire_embers_4k.mp4",
  },
  // 5. Gold Particles Shining Floor Loop (URL 316569921)
  {
    id: "GoldParticles",
    filename: "gold_particles_shining_floor_loop_4k.mp4",
  },
];

const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Starting Batch Render of ${presets.length} Requested 4K UHD Stock Videos...`);

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
