import { CyberGridProps } from "./compositions/CyberGrid";

export interface StockAssetPreset {
  id: string;
  filename: string;
  compositionId: string;
  props: CyberGridProps;
  title: string;
  keywords: string;
  category: number; // 15 = Technology & Infographics in Adobe Stock
}

export const STOCK_PRESETS: StockAssetPreset[] = [
  {
    id: "cyber-grid-cyan-blue-4k",
    filename: "cyber_grid_cyan_blue_loop_4k.mp4",
    compositionId: "CyberGrid",
    props: {
      primaryColor: "#00f2fe",
      secondaryColor: "#3b82f6",
      speed: 1,
      gridDensity: 32,
      starCount: 160,
    },
    title: "Abstract Blue Cyber Technology Network Grid Seamless Loop 4K",
    keywords:
      "seamless loop, abstract background, cyber grid, data network, technology, blue, glowing, futuristic, 4k, ultra hd, motion graphics, copy space, digital floor, cyberspace, internet, perspective, neon",
    category: 15,
  },
  {
    id: "cyber-grid-gold-luxury-4k",
    filename: "cyber_grid_gold_luxury_loop_4k.mp4",
    compositionId: "CyberGrid",
    props: {
      primaryColor: "#fbbf24",
      secondaryColor: "#f59e0b",
      speed: 1,
      gridDensity: 32,
      starCount: 160,
    },
    title: "Abstract Gold Cyber Luxury Grid Background Seamless Loop 4K",
    keywords:
      "seamless loop, abstract background, gold grid, luxury, technology, yellow, glowing, futuristic, 4k, ultra hd, motion graphics, wealth, finance, fintech, crypto, perspective, elegant, dark mode",
    category: 15,
  },
  {
    id: "cyber-grid-matrix-green-4k",
    filename: "cyber_grid_matrix_green_loop_4k.mp4",
    compositionId: "CyberGrid",
    props: {
      primaryColor: "#10b981",
      secondaryColor: "#059669",
      speed: 1,
      gridDensity: 32,
      starCount: 160,
    },
    title: "Cyber Security Matrix Green Grid Network Seamless Loop 4K",
    keywords:
      "seamless loop, cyber security, matrix green, abstract background, technology, glowing grid, coding, programming, hacker, digital network, 4k, ultra hd, motion graphics, cyberspace, data stream",
    category: 15,
  },
  {
    id: "cyber-grid-synthwave-magenta-4k",
    filename: "cyber_grid_synthwave_magenta_loop_4k.mp4",
    compositionId: "CyberGrid",
    props: {
      primaryColor: "#f43f5e",
      secondaryColor: "#8b5cf6",
      speed: 1,
      gridDensity: 32,
      starCount: 160,
    },
    title: "Synthwave Retro 80s Cyber Neon Grid Seamless Loop 4K",
    keywords:
      "seamless loop, synthwave, retrowave, neon grid, magenta, purple, 80s background, futuristic, cyber, motion graphics, 4k, ultra hd, glowing, arcade, electronic music backdrop, copy space",
    category: 15,
  },
];
