import React from "react";
import { Composition } from "remotion";
import { CyberGrid, defaultCyberGridProps } from "./compositions/CyberGrid";
import { GoldParticles, defaultGoldParticleProps } from "./compositions/GoldParticles";
import { SoftGradientLoop, defaultGradientProps } from "./compositions/SoftGradientLoop";
import { AudioWaveTech, defaultAudioWaveProps } from "./compositions/AudioWaveTech";

export const Root: React.FC = () => {
  return (
    <>
      {/* 1. Cyber Grid (Landscape 4K & Vertical) */}
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
        id="CyberGrid-Vertical"
        component={CyberGrid}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultCyberGridProps,
          gridDensity: 20,
          starCount: 100,
        }}
      />

      {/* 2. Gold Awards Particles & Bokeh (Landscape 4K & Vertical) */}
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
        id="GoldParticles-Vertical"
        component={GoldParticles}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultGoldParticleProps,
          particleCount: 120,
          bokehCount: 20,
        }}
      />

      {/* 3. Soft Blurred Gradient Cycle (Landscape 4K & Vertical) */}
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

      {/* 4. Digital Tech Audio Wave / Optical Fiber (Landscape 4K & Vertical) */}
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
        id="AudioWaveTech-Vertical"
        component={AudioWaveTech}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultAudioWaveProps,
          amplitude: 100,
        }}
      />
    </>
  );
};
