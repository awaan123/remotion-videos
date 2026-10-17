export interface StockPresetItem {
  id: string;
  filename: string;
  compositionId: string;
  title: string;
  keywords: string;
  category: number;
}

export const ALL_STOCK_PRESETS: StockPresetItem[] = [
  // 1. Cyber Grid
  {
    id: "CyberGrid",
    filename: "cyber_grid_blue_4k.mp4",
    compositionId: "CyberGrid",
    title: "Abstract Blue Cyber Technology Network Grid Seamless Loop 4K",
    keywords:
      "seamless loop, abstract background, cyber grid, data network, technology, blue, glowing, futuristic, 4k, ultra hd, motion graphics, copy space, digital floor, cyberspace",
    category: 15,
  },
  // 2. Gold Particles & Awards Bokeh
  {
    id: "GoldParticles",
    filename: "gold_particles_awards_bokeh_4k.mp4",
    compositionId: "GoldParticles",
    title: "Gold Particles Abstract Background Golden Floor Dust Bokeh Loop 4K",
    keywords:
      "seamless loop, gold particles, abstract background, shining golden floor, particle stars, dust, futuristic, glittering, fly movement, flickering, space, black background, 4k, awards",
    category: 15,
  },
  // 3. Soft Blurred Gradient
  {
    id: "SoftGradientLoop",
    filename: "soft_gradient_magenta_blue_cycle_4k.mp4",
    compositionId: "SoftGradientLoop",
    title: "Abstract Blurred Magenta Blue Orange Soft Gradient Cycle Loop 4K",
    keywords:
      "seamless loop, abstract blurred, magenta, blue, orange, soft gradient cycle, slow motion, background loop, holographic, colorful backdrop, 4k, ultra hd, modern, aesthetic",
    category: 15,
  },
  // 4. Optical Fiber / Audio Wave
  {
    id: "AudioWaveTech",
    filename: "optical_fiber_audio_wave_tech_4k.mp4",
    compositionId: "AudioWaveTech",
    title: "Abstract Blue Wave Technology Background Digital Audio Line Loop 4K",
    keywords:
      "seamless loop, abstract wave, technology background, blue light, digital effect, corporate concept, optical fiber, signal transmission, geometric line, 4k, ultra hd, motion design",
    category: 15,
  },
];
