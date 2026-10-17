import React from "react";
import { Composition } from "remotion";
import { SoftGradientLoop, defaultGradientProps } from "./compositions/SoftGradientLoop";
import { WaterDropletsExplosion, defaultWaterDropletsProps } from "./compositions/WaterDropletsExplosion";
import { NeonLowPolyMesh, defaultLowPolyProps } from "./compositions/NeonLowPolyMesh";
import { BlueNeonStripes, defaultNeonStripesProps } from "./compositions/BlueNeonStripes";
import { RainbowInkInWater } from "./compositions/RainbowInkInWater";
import { NeonDotsSpiralTunnel } from "./compositions/NeonDotsSpiralTunnel";
import { UnderwaterBubblesTurquoise } from "./compositions/UnderwaterBubblesTurquoise";
import { FireEmbersWind } from "./compositions/FireEmbersWind";
import { CyberGrid, defaultCyberGridProps } from "./compositions/CyberGrid";
import { GoldParticles, defaultGoldParticleProps } from "./compositions/GoldParticles";
import { AudioWaveTech, defaultAudioWaveProps } from "./compositions/AudioWaveTech";
import { NeonArrowsTunnel, defaultNeonArrowsProps } from "./compositions/NeonArrowsTunnel";
import { HyperspaceWarp, defaultHyperspaceProps } from "./compositions/HyperspaceWarp";

export const Root: React.FC = () => {
  return (
    <>
      {/* 1. Abstract Blurred Magenta Blue Orange Gradient Cycle (URL 1 & 2) */}
      <Composition
        id="SoftGradientLoop"
        component={SoftGradientLoop}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultGradientProps}
      />
      <Composition
        id="SoftGradientLoop-Vertical"
        component={SoftGradientLoop}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultGradientProps}
      />

      {/* 2. Explosion of Water Droplets Slow Motion on Black (URL 3) */}
      <Composition
        id="WaterDropletsExplosion"
        component={WaterDropletsExplosion}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultWaterDropletsProps}
      />
      <Composition
        id="WaterDropletsExplosion-Vertical"
        component={WaterDropletsExplosion}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultWaterDropletsProps,
          dropletCount: 220,
        }}
      />

      {/* 3. Futuristic Communication Neon Low-Poly Mesh (URL 4) */}
      <Composition
        id="NeonLowPolyMesh"
        component={NeonLowPolyMesh}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultLowPolyProps}
      />
      <Composition
        id="NeonLowPolyMesh-Vertical"
        component={NeonLowPolyMesh}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultLowPolyProps,
          cols: 16,
          rows: 24,
        }}
      />

      {/* 4. Blue Neon Glowing Stripes Abstract Modern Motion (URL 5) */}
      <Composition
        id="BlueNeonStripes"
        component={BlueNeonStripes}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultNeonStripesProps}
      />
      <Composition
        id="BlueNeonStripes-Vertical"
        component={BlueNeonStripes}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultNeonStripesProps,
          stripeCount: 16,
        }}
      />

      {/* 5. Rainbow Colored Ink in Water Fluid Dispersion (URL 327663872) */}
      <Composition
        id="RainbowInkInWater"
        component={RainbowInkInWater}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          backgroundColor: "#000000",
        }}
      />

      {/* 6. Neon Dots Spiral Tunnel with Metal Floor (URL 302044677) */}
      <Composition
        id="NeonDotsSpiralTunnel"
        component={NeonDotsSpiralTunnel}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          ringCount: 36,
          dotsPerRing: 48,
        }}
      />

      {/* 7. Underwater Slow Motion Bubbles in Turquoise Pool (URL 384830287) */}
      <Composition
        id="UnderwaterBubblesTurquoise"
        component={UnderwaterBubblesTurquoise}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          bubbleCount: 350,
        }}
      />

      {/* 8. Fire Embers & Sparks Flying in Wind (URL 355415262) */}
      <Composition
        id="FireEmbersWind"
        component={FireEmbersWind}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          particleCount: 500,
        }}
      />

      {/* Previously created high-value templates */}
      <Composition
        id="CyberGrid"
        component={CyberGrid}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultCyberGridProps}
      />
      <Composition
        id="GoldParticles"
        component={GoldParticles}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultGoldParticleProps}
      />
      <Composition
        id="AudioWaveTech"
        component={AudioWaveTech}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultAudioWaveProps}
      />
      <Composition
        id="NeonArrowsTunnel"
        component={NeonArrowsTunnel}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultNeonArrowsProps}
      />
      <Composition
        id="HyperspaceWarp"
        component={HyperspaceWarp}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultHyperspaceProps}
      />
    </>
  );
};
