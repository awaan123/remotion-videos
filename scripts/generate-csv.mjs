import fs from "fs";
import path from "path";

const presets = [
  {
    filename: "cyber_grid_blue_4k.mp4",
    title: "Abstract Blue Cyber Technology Network Grid Seamless Loop 4K",
    keywords:
      "seamless loop, abstract background, cyber grid, data network, technology, blue, glowing, futuristic, 4k, ultra hd, motion graphics, copy space, digital floor, cyberspace",
    category: 15,
  },
  {
    filename: "gold_particles_awards_bokeh_4k.mp4",
    title: "Gold Particles Abstract Background Golden Floor Dust Bokeh Loop 4K",
    keywords:
      "seamless loop, gold particles, abstract background, shining golden floor, particle stars, dust, futuristic, glittering, fly movement, flickering, space, black background, 4k, awards",
    category: 15,
  },
  {
    filename: "soft_gradient_magenta_blue_cycle_4k.mp4",
    title: "Abstract Blurred Magenta Blue Orange Soft Gradient Cycle Loop 4K",
    keywords:
      "seamless loop, abstract blurred, magenta, blue, orange, soft gradient cycle, slow motion, background loop, holographic, colorful backdrop, 4k, ultra hd, modern, aesthetic",
    category: 15,
  },
  {
    filename: "optical_fiber_audio_wave_tech_4k.mp4",
    title: "Abstract Blue Wave Technology Background Digital Audio Line Loop 4K",
    keywords:
      "seamless loop, abstract wave, technology background, blue light, digital effect, corporate concept, optical fiber, signal transmission, geometric line, 4k, ultra hd, motion design",
    category: 15,
  },
  {
    filename: "neon_arrows_tunnel_4k.mp4",
    title: "Abstract Glowing Motion Design with Blue Purple Neon Arrows Tunnel 4K",
    keywords:
      "seamless loop, abstract glowing, motion design, blue purple, neon arrows, chevron tunnel, futuristic, cyber corridor, 4k, ultra hd, perspective, electronic, party backdrop",
    category: 15,
  },
  {
    filename: "hyperspace_lightspeed_tunnel_4k.mp4",
    title: "Hyperspace Jump Flying Through Lightspeed Starfield Tunnel Loop 4K",
    keywords:
      "seamless loop, hyperspace jump, flying through space, lightspeed tunnel, starfield, acceleration, spaceship, speed of light, cosmic void, universe, screensaver, 4k, sci fi",
    category: 15,
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

console.log(`Adobe Stock CSV Generated with all 6 templates! Saved to: ${outputPath}`);
