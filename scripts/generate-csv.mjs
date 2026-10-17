import fs from "fs";
import path from "path";

const presets = [
  // 1. Soft Gradient Cycle Loop (URL 444098349)
  {
    filename: "soft_gradient_magenta_blue_cycle_4k.mp4",
    title: "Vibrant Fluid Gradient Waves Colorful Pastel Motion Loop 4K",
    keywords:
      "abstract, blurred, magenta, blue, orange, soft gradient, cycle, slow motion, background loop, loop, seamless, colorful, holographic, fluid, modern, backdrop, motion graphic, 4k, ultra hd, aesthetic, vibrant, pastel, animated, gradient flow, smooth, texture, graphic design, corporate, minimal, dynamic, wallpaper, elegant, spectrum, presentation, creative, neon, purple, violet, waves, blur, glowing, contemporary, banner, intro, clean, overlay, liquid, screen saver, visual effect",
    category: 8,
  },
  // 2. High-Speed 3D Water Droplets Explosion (URL 385117562)
  {
    filename: "explosion_water_droplets_slow_motion_4k.mp4",
    title: "High Speed Water Droplets Burst Slow Motion on Black 4K",
    keywords:
      "water droplets, explosion, slow motion, isolated, black background, splash, burst, fluid, liquid, high speed, moisture, droplet, spray, clear, fresh, aqua, splash effect, 4k, ultra hd, particles, motion, transparent, wet, macro, clean, purity, dynamic, impact, freeze frame, bubble, wave, drink, refreshment, cinematic, overlay, visual effect, action, shockwave, purity concept, hydration, dark background, studio shot, realistic, droplets in air, water surface, physics, water ripple, dispersion, element",
    category: 8,
  },
  // 3. Futuristic Neon Low-Poly Mesh (URL 334822777)
  {
    filename: "neon_low_poly_communication_mesh_4k.mp4",
    title: "Cyber Network Low Poly Geometric Wireframe Loop 4K",
    keywords:
      "abstract, futuristic, communication, neon, low poly, motion background, network, wireframe, polygon, loop, seamless, cyber, technology, digital, data, connecting nodes, mesh, 4k, ultra hd, geometric, science, internet, connection, big data, artificial intelligence, computer, glowing, blue, violet, cyberspace, backdrop, corporate, cloud computing, binary, innovation, business, plexus, web, blockchain, grid, virtual reality, information, server, high tech, infrastructure, electronic, digital communication, security, dark blue",
    category: 19,
  },
  // 4. Blue Neon Glowing Stripes (URL 316914640)
  {
    filename: "blue_neon_glowing_stripes_motion_4k.mp4",
    title: "Dynamic Blue Neon Light Beams Diagonal Speed Loop 4K",
    keywords:
      "blue neon, glowing stripes, abstract, modern, motion background, speed lines, light beams, loop, seamless, futuristic, technology, cyber, diagonal, electric, laser, 4k, ultra hd, glowing, corporate, backdrop, fast, motion graphics, bright, illumination, race, velocity, digital, energy, stream, highway, traffic, ray, dark background, night, show, stage, club, led, shine, dynamic, presentation, synthwave, minimal, concert, line art, visual effect, optical, pattern, screensaver",
    category: 19,
  },
  // 5. Rainbow Colored Ink in Water (URL 327663872)
  {
    filename: "rainbow_colored_ink_in_water_dispersion_4k.mp4",
    title: "Chromatic Ink Cloud Swirl in Water Slow Motion 4K",
    keywords:
      "rainbow colored, ink in water, fluid dispersion, slow motion, ink, water, acrylic, cloud, swirl, liquid, colorful, smoke plume, splash, vortex, watercolor, 4k, ultra hd, isolated, black background, macro, artistic, abstract, motion, mixing, drop, underwater, paint, multi colored, pigment, vibrant, dynamic, flow, blend, creative, texture, turbulence, diffusion, dissolution, high speed, design, backdrop, explosion, tendrils, plumes, saturated, chromatic, visual effect, element, overlay",
    category: 8,
  },
  // 6. Neon Dots Spiral Tunnel with Metal Floor (URL 302044677)
  {
    filename: "neon_dots_spiral_tunnel_metal_floor_4k.mp4",
    title: "Cyber Neon Dots Spiral Tunnel Reflective Floor Loop 4K",
    keywords:
      "abstract, motion, background, circle, light, neon, space, tunnel, blue, club, corridor, dot, fashion, futuristic, laser, metal, modern, party, round, shape, show, stage, technology, animation, colours, creative, cyber, design, floor, footage, frame, glow, graphic, hypnotic, pink, purple, science fiction, spiral, swirl, violet, wallpaper, web, scratched metal, reflective floor, dots tunnel, 4k, ultra hd, loop, seamless",
    category: 8,
  },
  // 7. Underwater Slow Motion Bubbles in Turquoise Pool (URL 384830287)
  {
    filename: "underwater_bubbles_turquoise_pool_4k.mp4",
    title: "Turquoise Water Slow Motion Bubbles Rising to Surface 4K",
    keywords:
      "underwater, slow motion, bubbles, turquoise, crystal clear, pool, swimming pool, surface, water, sun rays, sunlight, aqua, deep blue, liquid, fluid, summer, fresh, clean, pure, translucent, refraction, caustics, bokeh, floating, rising, oxygen, air bubbles, marine, ocean, sea, diving, resort, vacation, relaxation, calm, peaceful, 4k, ultra hd, background, backdrop, abstract, motion, nature, refreshment, splash, clarity, crystal, ripple, shimmer",
    category: 8,
  },
  // 8. Particles Flying in Wind on Fire (URL 355415262)
  {
    filename: "particles_flying_in_wind_fire_embers_4k.mp4",
    title: "Blazing Fire Embers and Sparks Flying in Wind 4K Loop",
    keywords:
      "fire, embers, sparks, particles, flying in wind, wind, flame, burning, heat, hot, blaze, inferno, smoke, ash, bonfire, campfire, glowing, orange, red, yellow, golden, dark background, isolated, black background, cinematic, slow motion, vfx, overlay, visual effect, energy, warmth, danger, action, dynamic, turbulent, motion, loop, seamless, 4k, ultra hd, explosive, combustion, ignite, fiery, sparks flying, flying particles, glow, blast, atmospheric",
    category: 8,
  },
  // 9. Luxury Gold Particles Dust on Floor (URL 316569921)
  {
    filename: "gold_particles_shining_floor_loop_4k.mp4",
    title: "Luxury Gold Particles Shining Floor Glitter Dust Loop 4K",
    keywords:
      "gold particles, abstract background, shining, golden floor, particle stars, dust, futuristic, glittering, fly movement, flickering, loop, seamless, space, black background, luxury, glamour, award, elegant, bokeh, shimmer, sparkle, magic, celebration, christmas, new year, party, rich, wealth, vip, 4k, ultra hd, motion graphic, backdrop, cinematic, star dust, golden dust, floating particles, night, dark, shine, glow, bright, yellow, amber, fantasy, event, intro, presentation, special effect",
    category: 8,
  },
  // 10. Strong Rain at Night (URL 197058599)
  {
    filename: "strong_rain_at_night_cinematic_4k.mp4",
    title: "Heavy Cinematic Storm Rain at Night Background 4K Loop",
    keywords:
      "rain, night, strong rain, heavy rain, storm, downpour, dark, water droplets, wet, weather, raining, cinematic, moody, night city, atmosphere, motion, splashing, puddle, drops, slow motion, thunderstorm, nature, fluid, liquid, autumn, winter, window, lens, cold, shower, spray, precipitation, overcast, darkness, urban, mist, haze, 4k, ultra hd, background, backdrop, clean, street, asphalt, ripple, wind, reflection, overlay, visual effect",
    category: 8,
  },
  // 11. Abstract Glowing Neon Arrows (URL 381536144)
  {
    filename: "abstract_glowing_neon_arrows_loop_4k.mp4",
    title: "Futuristic Blue Purple Neon Arrows Chevron Tunnel 4K Loop",
    keywords:
      "neon arrows, abstract, glowing, motion design, blue, purple, magenta, cyan, chevron, tunnel, speed, futuristic, cyber, technology, loop, seamless, direction, forward, flight, laser, light, show, stage, vj loop, synthwave, retrowave, nightclub, party, digital, data, highway, virtual reality, sci fi, energy, beam, line, modern, backdrop, background, 4k, ultra hd, motion graphic, floor reflection, corridor, space, geometric, innovation, power, vibrant",
    category: 8,
  },
  // 12. 4K Abstract Swirls (URL 220530931)
  {
    filename: "abstract_chromatic_swirls_flow_4k.mp4",
    title: "Chromatic Glowing Fluid Swirls Rainbow Ribbon Flow 4K",
    keywords:
      "abstract swirls, swirls, abstract, fluid, chromatic, rainbow, colorful, flow, wave, spiral, helix, curved, smooth, motion, loop, seamless, 3d, dynamic, vibrant, ribbon, gradient, modern, aesthetic, holographic, liquid, design, art, creative, concept, digital, energy, spectrum, neon, glow, shine, violet, cyan, magenta, orange, backdrop, background, wallpaper, 4k, ultra hd, presentation, intro, minimal, overlay, visual effect",
    category: 8,
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

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : outDir;
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const outputPath = path.join(targetDir, "adobe_stock_metadata.csv");
fs.writeFileSync(outputPath, csvHeader + csvRows, "utf-8");

console.log(`Adobe Stock CSV Generated! Saved to: ${outputPath}`);
