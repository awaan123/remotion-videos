import fs from "fs";
import path from "path";

const presets = [
  {
    filename: "soft_gradient_magenta_blue_cycle_4k.mp4",
    title: "Abstract Blurred Magenta Blue Orange Soft Gradient Cycle Loop 4K",
    keywords:
      "seamless loop, abstract blurred, magenta, blue, orange, soft gradient cycle, slow motion, background loop, holographic, colorful backdrop, 4k, ultra hd, modern, aesthetic",
    category: 15,
  },
  {
    filename: "explosion_water_droplets_slow_motion_4k.mp4",
    title: "Explosion of Water Droplets Into Camera Slow Motion on Black 4K",
    keywords:
      "water droplets, explosion, slow motion, water splash, isolated on black, liquid burst, high speed, droplets into camera, fluid motion, 4k, ultra hd, transparent overlay, particles",
    category: 15,
  },
  {
    filename: "neon_low_poly_communication_mesh_4k.mp4",
    title: "Abstract Futuristic Communication Neon Low Poly Motion Loop 4K",
    keywords:
      "seamless loop, abstract futuristic, communication, neon low poly, motion background, digital network, cyber technology, wireframe, connecting nodes, data transfer, 4k, ultra hd",
    category: 15,
  },
  {
    filename: "blue_neon_glowing_stripes_motion_4k.mp4",
    title: "Blue Neon Glowing Stripes Abstract Modern Motion Background 4K",
    keywords:
      "seamless loop, blue neon, glowing stripes, abstract modern, motion background, speed lines, light bars, futuristic, technology, cyber beam, corporate, 4k, ultra hd",
    category: 15,
  },
  {
    filename: "rainbow_colored_ink_in_water_dispersion_4k.mp4",
    title: "Rainbow Colored Ink in Water Fluid Dispersion Slow Motion 4K",
    keywords:
      "rainbow ink, ink in water, fluid dispersion, slow motion, acrylic colors, swirling smoke plumes, liquid vortex, chromatic splash, watercolor burst, 4k, ultra hd, high speed, abstract art",
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

console.log(`Adobe Stock CSV Generated! Saved to: ${outputPath}`);
