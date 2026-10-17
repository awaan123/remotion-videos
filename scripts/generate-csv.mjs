import fs from "fs";
import path from "path";

const presets = [
  // 1. Rainbow Colored Ink in Water (URL 327663872)
  {
    filename: "rainbow_colored_ink_in_water_dispersion_4k.mp4",
    title: "Chromatic Ink Cloud Swirl in Water Slow Motion 4K",
    keywords:
      "rainbow colored, ink in water, fluid dispersion, slow motion, ink, water, acrylic, cloud, swirl, liquid, colorful, smoke plume, splash, vortex, watercolor, 4k, ultra hd, isolated, black background, macro, artistic, abstract, motion, mixing, drop, underwater, paint, multi colored, pigment, vibrant, dynamic, flow, blend, creative, texture, turbulence, diffusion, dissolution, high speed, design, backdrop, explosion, tendrils, plumes, saturated, chromatic, visual effect, element, overlay",
    category: 8, // Graphic Resources
  },
  // 2. Neon Dots Spiral Tunnel with Metal Floor (URL 302044677)
  {
    filename: "neon_dots_spiral_tunnel_metal_floor_4k.mp4",
    title: "Cyber Neon Dots Spiral Tunnel Reflective Floor Loop 4K",
    keywords:
      "abstract, motion, background, circle, light, neon, space, tunnel, blue, club, corridor, dot, fashion, futuristic, laser, metal, modern, party, round, shape, show, stage, technology, animation, colours, creative, cyber, design, floor, footage, frame, glow, graphic, hypnotic, pink, purple, science fiction, spiral, swirl, violet, wallpaper, web, scratched metal, reflective floor, dots tunnel, 4k, ultra hd, loop, seamless",
    category: 8, // Graphic Resources
  },
  // 3. Underwater Slow Motion Bubbles in Turquoise Pool (URL 384830287)
  {
    filename: "underwater_bubbles_turquoise_pool_4k.mp4",
    title: "Turquoise Water Slow Motion Bubbles Rising to Surface 4K",
    keywords:
      "underwater, slow motion, bubbles, turquoise, crystal clear, pool, swimming pool, surface, water, sun rays, sunlight, aqua, deep blue, liquid, fluid, summer, fresh, clean, pure, translucent, refraction, caustics, bokeh, floating, rising, oxygen, air bubbles, marine, ocean, sea, diving, resort, vacation, relaxation, calm, peaceful, 4k, ultra hd, background, backdrop, abstract, motion, nature, refreshment, splash, clarity, crystal, ripple, shimmer",
    category: 8, // Graphic Resources
  },
  // 4. Fire Embers & Sparks Flying in Wind (URL 355415262)
  {
    filename: "particles_flying_in_wind_fire_embers_4k.mp4",
    title: "Blazing Fire Embers and Sparks Flying in Wind 4K Loop",
    keywords:
      "fire, embers, sparks, particles, flying in wind, wind, flame, burning, heat, hot, blaze, inferno, smoke, ash, bonfire, campfire, glowing, orange, red, yellow, golden, dark background, isolated, black background, cinematic, slow motion, vfx, overlay, visual effect, energy, warmth, danger, action, dynamic, turbulent, motion, loop, seamless, 4k, ultra hd, explosive, combustion, ignite, fiery, sparks flying, flying particles, glow, blast, atmospheric",
    category: 8, // Graphic Resources
  },
  // 5. Gold Particles Shining Floor Loop (URL 316569921)
  {
    filename: "gold_particles_shining_floor_loop_4k.mp4",
    title: "Luxury Gold Particles Shining Floor Glitter Dust Loop 4K",
    keywords:
      "gold particles, abstract background, shining, golden floor, particle stars, dust, futuristic, glittering, fly movement, flickering, loop, seamless, space, black background, luxury, glamour, award, elegant, bokeh, shimmer, sparkle, magic, celebration, christmas, new year, party, rich, wealth, vip, 4k, ultra hd, motion graphic, backdrop, cinematic, star dust, golden dust, floating particles, night, dark, shine, glow, bright, yellow, amber, fantasy, event, intro, presentation, special effect",
    category: 8, // Graphic Resources
  },
];

const outDir = path.resolve("./out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const csvHeader = "Filename,Title,Keywords,Category\n";
const csvRows = presets
  .map(
    (p) =>
      `"${p.filename}","${p.title.replace(/"/g, '""')}","${p.keywords.replace(
        /"/g,
        '""'
      )}",${p.category}`
  )
  .join("\n");

const outputPath = path.join(outDir, "adobe_stock_metadata.csv");
fs.writeFileSync(outputPath, csvHeader + csvRows, "utf-8");

console.log(`Adobe Stock CSV Generated! Saved to: ${outputPath}`);
