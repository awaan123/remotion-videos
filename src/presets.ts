export interface StockPresetItem {
  id: string;
  filename: string;
  compositionId: string;
  title: string;
  keywords: string;
  category: number; // 8: Graphic Resources, 19: Technology
}

export const TARGET_REQUESTED_PRESETS: StockPresetItem[] = [
  // 1. High-Speed 3D Water Droplets Explosion (URL 385117562)
  {
    id: "WaterDropletsExplosion",
    filename: "explosion_water_droplets_slow_motion_4k.mp4",
    compositionId: "WaterDropletsExplosion",
    title: "High Speed Water Droplets Burst Slow Motion on Black 4K",
    keywords:
      "water droplets, explosion, slow motion, isolated, black background, splash, burst, fluid, liquid, high speed, moisture, droplet, spray, clear, fresh, aqua, splash effect, 4k, ultra hd, particles, motion, transparent, wet, macro, clean, purity, dynamic, impact, freeze frame, bubble, wave, drink, refreshment, cinematic, overlay, visual effect, action, shockwave, purity concept, hydration, dark background, studio shot, realistic, droplets in air, water surface, physics, water ripple, dispersion, element",
    category: 8,
  },
  // 2. Luxury Gold Particles Dust on Floor (URL 316569921)
  {
    id: "GoldParticles",
    filename: "gold_particles_shining_floor_loop_4k.mp4",
    compositionId: "GoldParticles",
    title: "Luxury Gold Particles Shining Floor Glitter Dust Loop 4K",
    keywords:
      "gold particles, abstract background, shining, golden floor, particle stars, dust, futuristic, glittering, fly movement, flickering, loop, seamless, space, black background, luxury, glamour, award, elegant, bokeh, shimmer, sparkle, magic, celebration, christmas, new year, party, rich, wealth, vip, 4k, ultra hd, motion graphic, backdrop, cinematic, star dust, golden dust, floating particles, night, dark, shine, glow, bright, yellow, amber, fantasy, event, intro, presentation, special effect",
    category: 8,
  },
  // 3. Strong Rain at Night (URL 197058599)
  {
    id: "StrongRainNight",
    filename: "strong_rain_at_night_cinematic_4k.mp4",
    compositionId: "StrongRainNight",
    title: "Heavy Cinematic Storm Rain at Night Background 4K Loop",
    keywords:
      "rain, night, strong rain, heavy rain, storm, downpour, dark, water droplets, wet, weather, raining, cinematic, moody, night city, atmosphere, motion, splashing, puddle, drops, slow motion, thunderstorm, nature, fluid, liquid, autumn, winter, window, lens, cold, shower, spray, precipitation, overcast, darkness, urban, mist, haze, 4k, ultra hd, background, backdrop, clean, street, asphalt, ripple, wind, reflection, overlay, visual effect",
    category: 8,
  },
  // 4. Abstract Glowing Neon Arrows (URL 381536144)
  {
    id: "NeonArrowsTunnel",
    filename: "abstract_glowing_neon_arrows_loop_4k.mp4",
    compositionId: "NeonArrowsTunnel",
    title: "Futuristic Blue Purple Neon Arrows Chevron Tunnel 4K Loop",
    keywords:
      "neon arrows, abstract, glowing, motion design, blue, purple, magenta, cyan, chevron, tunnel, speed, futuristic, cyber, technology, loop, seamless, direction, forward, flight, laser, light, show, stage, vj loop, synthwave, retrowave, nightclub, party, digital, data, highway, virtual reality, sci fi, energy, beam, line, modern, backdrop, background, 4k, ultra hd, motion graphic, floor reflection, corridor, space, geometric, innovation, power, vibrant",
    category: 8,
  },
  // 5. 4K Abstract Swirls (URL 220530931)
  {
    id: "AbstractSwirls4K",
    filename: "abstract_chromatic_swirls_flow_4k.mp4",
    compositionId: "AbstractSwirls4K",
    title: "Chromatic Glowing Fluid Swirls Rainbow Ribbon Flow 4K",
    keywords:
      "abstract swirls, swirls, abstract, fluid, chromatic, rainbow, colorful, flow, wave, spiral, helix, curved, smooth, motion, loop, seamless, 3d, dynamic, vibrant, ribbon, gradient, modern, aesthetic, holographic, liquid, design, art, creative, concept, digital, energy, spectrum, neon, glow, shine, violet, cyan, magenta, orange, backdrop, background, wallpaper, 4k, ultra hd, presentation, intro, minimal, overlay, visual effect",
    category: 8,
  },
];
