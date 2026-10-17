import React from "react";
import { Composition } from "remotion";
import { CyberGrid, defaultCyberGridProps } from "./compositions/CyberGrid";
import { STOCK_PRESETS } from "./presets";

export const Root: React.FC = () => {
  return (
    <>
      {/* Default 4K Composition (3840x2160, 30fps, 10 seconds = 300 frames) */}
      <Composition
        id="CyberGrid"
        component={CyberGrid}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={defaultCyberGridProps}
      />

      {/* Preset Compositions for 1-Click Studio Previews & Renders */}
      {STOCK_PRESETS.map((preset) => (
        <Composition
          key={preset.id}
          id={preset.id}
          component={CyberGrid}
          durationInFrames={300}
          fps={30}
          width={3840}
          height={2160}
          defaultProps={preset.props}
        />
      ))}

      {/* Vertical 9:16 Version (1080x1920) for Social / Shorts Stock */}
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
    </>
  );
};
