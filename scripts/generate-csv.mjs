import fs from "fs";
import path from "path";

const presets = [
  {
    filename: "soft_gradient_magenta_blue_cycle_4k.mp4",
    title: "Vibrant Fluid Gradient Waves Colorful Pastel Motion Loop 4K",
    keywords:
      "abstract, blurred, magenta, blue, orange, soft gradient, cycle, slow motion, background loop, loop, seamless, colorful, holographic, fluid, modern, backdrop, motion graphic, 4k, ultra hd, aesthetic, vibrant, pastel, animated, gradient flow, smooth, texture, graphic design, corporate, minimal, dynamic, wallpaper, elegant, spectrum, presentation, creative, neon, purple, violet, waves, blur, glowing, contemporary, banner, intro, clean, overlay, liquid, screen saver, visual effect",
    category: 8, // Graphic Resources
  },
  {
    filename: "explosion_water_droplets_slow_motion_4k.mp4",
    title: "High Speed Water Droplets Burst Slow Motion on Black 4K",
    keywords:
      "water droplets, explosion, slow motion, isolated, black background, splash, burst, fluid, liquid, high speed, moisture, droplet, spray, clear, fresh, aqua, splash effect, 4k, ultra hd, particles, motion, transparent, wet, macro, clean, purity, dynamic, impact, freeze frame, bubble, wave, drink, refreshment, cinematic, overlay, visual effect, action, shockwave, purity concept, hydration, dark background, studio shot, realistic, droplets in air, water surface, physics, water ripple, dispersion, element",
    category: 8, // Graphic Resources
  },
  {
    filename: "neon_low_poly_communication_mesh_4k.mp4",
    title: "Cyber Network Low Poly Geometric Wireframe Loop 4K",
    keywords:
      "abstract, futuristic, communication, neon, low poly, motion background, network, wireframe, polygon, loop, seamless, cyber, technology, digital, data, connecting nodes, mesh, 4k, ultra hd, geometric, science, internet, connection, big data, artificial intelligence, computer, glowing, blue, violet, cyberspace, backdrop, corporate, cloud computing, binary, innovation, business, plexus, web, blockchain, grid, virtual reality, information, server, high tech, infrastructure, electronic, digital communication, security, dark blue",
    category: 19, // Technology
  },
  {
    filename: "blue_neon_glowing_stripes_motion_4k.mp4",
    title: "Dynamic Blue Neon Light Beams Diagonal Speed Loop 4K",
    keywords:
      "blue neon, glowing stripes, abstract, modern, motion background, speed lines, light beams, loop, seamless, futuristic, technology, cyber, diagonal, electric, laser, 4k, ultra hd, glowing, corporate, backdrop, fast, motion graphics, bright, illumination, race, velocity, digital, energy, stream, highway, traffic, ray, dark background, night, show, stage, club, led, shine, dynamic, presentation, synthwave, minimal, concert, line art, visual effect, optical, pattern, screensaver",
    category: 19, // Technology
  },
  {
    filename: "rainbow_colored_ink_in_water_dispersion_4k.mp4",
    title: "Chromatic Ink Cloud Swirl in Water Slow Motion 4K",
    keywords:
      "rainbow colored, ink in water, fluid dispersion, slow motion, ink, water, acrylic, cloud, swirl, liquid, colorful, smoke plume, splash, vortex, watercolor, 4k, ultra hd, isolated, black background, macro, artistic, abstract, motion, mixing, drop, underwater, paint, multi colored, pigment, vibrant, dynamic, flow, blend, creative, texture, turbulence, diffusion, dissolution, high speed, design, backdrop, explosion, tendrils, plumes, saturated, chromatic, visual effect, element, overlay",
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
