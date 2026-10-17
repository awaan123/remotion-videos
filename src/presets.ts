export interface StockPresetItem {
  id: string;
  filename: string;
  compositionId: string;
  title: string;
  keywords: string;
  category: number; // 8: Graphic Resources, 19: Technology
}

export const TARGET_REQUESTED_PRESETS: StockPresetItem[] = [
  // 1. Rainbow Colored Ink in Water (URL 327663872)
  {
    id: "RainbowInkInWater",
    filename: "rainbow_colored_ink_in_water_dispersion_4k.mp4",
    compositionId: "RainbowInkInWater",
    title: "Chromatic Ink Cloud Swirl in Water Slow Motion 4K",
    keywords:
      "rainbow colored, ink in water, fluid dispersion, slow motion, ink, water, acrylic, cloud, swirl, liquid, colorful, smoke plume, splash, vortex, watercolor, 4k, ultra hd, isolated, black background, macro, artistic, abstract, motion, mixing, drop, underwater, paint, multi colored, pigment, vibrant, dynamic, flow, blend, creative, texture, turbulence, diffusion, dissolution, high speed, design, backdrop, explosion, tendrils, plumes, saturated, chromatic, visual effect, element, overlay",
    category: 8,
  },
  // 2. Neon Dots Spiral Tunnel with Scratched Metal Floor (URL 302044677)
  {
    id: "NeonDotsSpiralTunnel",
    filename: "neon_dots_spiral_tunnel_metal_floor_4k.mp4",
    compositionId: "NeonDotsSpiralTunnel",
    title: "Cyber Neon Dots Spiral Tunnel Reflective Floor Loop 4K",
    keywords:
      "abstract, motion, background, circle, light, neon, space, tunnel, blue, club, corridor, dot, fashion, futuristic, laser, metal, modern, party, round, shape, show, stage, technology, animation, colours, creative, cyber, design, floor, footage, frame, glow, graphic, hypnotic, pink, purple, science fiction, spiral, swirl, violet, wallpaper, web, scratched metal, reflective floor, dots tunnel, 4k, ultra hd, loop, seamless",
    category: 8,
  },
  // 3. Underwater Slow Motion Bubbles in Turquoise Pool (URL 384830287)
  {
    id: "UnderwaterBubblesTurquoise",
    filename: "underwater_bubbles_turquoise_pool_4k.mp4",
    compositionId: "UnderwaterBubblesTurquoise",
    title: "Turquoise Water Slow Motion Bubbles Rising to Surface 4K",
    keywords:
      "underwater, slow motion, bubbles, turquoise, crystal clear, pool, swimming pool, surface, water, sun rays, sunlight, aqua, deep blue, liquid, fluid, summer, fresh, clean, pure, translucent, refraction, caustics, bokeh, floating, rising, oxygen, air bubbles, marine, ocean, sea, diving, resort, vacation, relaxation, calm, peaceful, 4k, ultra hd, background, backdrop, abstract, motion, nature, refreshment, splash, clarity, crystal, ripple, shimmer",
    category: 8,
  },
  // 4. Particles Flying in Wind on Fire (URL 355415262)
  {
    id: "FireEmbersWind",
    filename: "particles_flying_in_wind_fire_embers_4k.mp4",
    compositionId: "FireEmbersWind",
    title: "Blazing Fire Embers and Sparks Flying in Wind 4K Loop",
    keywords:
      "fire, embers, sparks, particles, flying in wind, wind, flame, burning, heat, hot, blaze, inferno, smoke, ash, bonfire, campfire, glowing, orange, red, yellow, golden, dark background, isolated, black background, cinematic, slow motion, vfx, overlay, visual effect, energy, warmth, danger, action, dynamic, turbulent, motion, loop, seamless, 4k, ultra hd, explosive, combustion, ignite, fiery, sparks flying, flying particles, glow, blast, atmospheric",
    category: 8,
  },
  // 5. Gold Particles Dust on Floor (URL 316569921)
  {
    id: "GoldParticles",
    filename: "gold_particles_shining_floor_loop_4k.mp4",
    compositionId: "GoldParticles",
    title: "Luxury Gold Particles Shining Floor Glitter Dust Loop 4K",
    keywords:
      "gold particles, abstract background, shining, golden floor, particle stars, dust, futuristic, glittering, fly movement, flickering, loop, seamless, space, black background, luxury, glamour, award, elegant, bokeh, shimmer, sparkle, magic, celebration, christmas, new year, party, rich, wealth, vip, 4k, ultra hd, motion graphic, backdrop, cinematic, star dust, golden dust, floating particles, night, dark, shine, glow, bright, yellow, amber, fantasy, event, intro, presentation, special effect",
    category: 8,
  },
];
