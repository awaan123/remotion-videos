import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface BlueNeonStripesProps {
  beamCount?: number;
  blockCount?: number;
}

export const defaultNeonStripesProps: BlueNeonStripesProps = {
  beamCount: 28,
  blockCount: 45,
};

export const BlueNeonStripes: React.FC<BlueNeonStripesProps> = ({
  beamCount = 28,
  blockCount = 45,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Seamless loop progress (0 to 1)
  const progress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = progress * Math.PI * 2;

  // 12-degree diagonal tilt matching reference 316914640
  const tiltAngleDeg = -12;

  // 1. Pre-generate soft background light curtain beams
  const curtainBeams = useMemo(() => {
    return Array.from({ length: beamCount }).map((_, i) => {
      const xPercent = (i / beamCount) * 1.3 - 0.15; // Spread beyond edges for rotation
      const beamWidth = 35 + ((i * 37) % 65);
      const intensity = 0.35 + ((i * 19) % 50) * 0.012;
      const speedMod = 0.8 + ((i * 13) % 7) * 0.1;
      const phase = (i * 2.39) % (Math.PI * 2);

      // Color tint based on horizontal location: center is Cyan, edges are Deep Purple
      const distFromCenter = Math.abs(xPercent - 0.5) * 2; // 0 (center) to 1 (edge)
      const isCenter = distFromCenter < 0.45;

      return {
        id: i,
        xPercent,
        beamWidth,
        intensity,
        speedMod,
        phase,
        isCenter,
        distFromCenter,
      };
    });
  }, [beamCount]);

  // 2. Pre-generate dynamic high-speed sliding rectangular light blocks (Reference detail!)
  const lightBlocks = useMemo(() => {
    return Array.from({ length: blockCount }).map((_, i) => {
      const xPercent = (Math.sin(i * 17.3) * 0.5 + 0.5) * 1.2 - 0.1;
      const blockWidth = 8 + ((i * 29) % 32);
      const blockHeight = 120 + ((i * 47) % 380);
      const speed = 1.0 + ((i * 11) % 15) * 0.12;
      const offset = (i * 31) % 100 / 100;
      const brightness = 0.5 + ((i * 23) % 50) * 0.01;

      const distFromCenter = Math.abs(xPercent - 0.5) * 2;
      const isCyan = distFromCenter < 0.55;

      return {
        id: i,
        xPercent,
        blockWidth,
        blockHeight,
        speed,
        offset,
        brightness,
        isCyan,
      };
    });
  }, [blockCount]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#03040c",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <filter id="neonBeamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Deep Blue/Indigo Vignette Background */}
          <linearGradient id="bgBackdrop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#120626" />
            <stop offset="25%" stopColor="#081033" />
            <stop offset="50%" stopColor="#031e42" />
            <stop offset="75%" stopColor="#081033" />
            <stop offset="100%" stopColor="#120626" />
          </linearGradient>

          {/* Cyan Light Beam Gradient */}
          <linearGradient id="cyanBeamGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="35%" stopColor="#00f0ff" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#00f0ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>

          {/* Deep Purple/Indigo Edge Beam Gradient */}
          <linearGradient id="purpleBeamGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7928ca" stopOpacity="0" />
            <stop offset="50%" stopColor="#9333ea" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7928ca" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base Studio Backdrop */}
        <rect width={width} height={height} fill="url(#bgBackdrop)" />

        {/* Tilted Light Curtain Container */}
        <g
          transform={`translate(${width / 2}, ${height / 2}) rotate(${tiltAngleDeg}) translate(${-width / 2}, ${-height / 2})`}
        >
          {/* Layer 1: Soft Ambient Background Vertical Light Columns */}
          {curtainBeams.map((b) => {
            const curX = b.xPercent * width;
            const pulse = 0.8 + 0.2 * Math.sin(loopAngle * b.speedMod + b.phase);
            const fillGrad = b.isCenter ? "url(#cyanBeamGrad)" : "url(#purpleBeamGrad)";

            return (
              <rect
                key={b.id}
                x={curX - b.beamWidth / 2}
                y={-height * 0.5}
                width={b.beamWidth}
                height={height * 2.0}
                fill={fillGrad}
                opacity={b.intensity * pulse}
                style={{ mixBlendMode: "screen" }}
              />
            );
          })}

          {/* Layer 2: Fast-Sliding Rectangular Neon Light Blocks (Reference detail!) */}
          <g filter="url(#neonBeamGlow)" style={{ mixBlendMode: "screen" }}>
            {lightBlocks.map((blk) => {
              // Upward/downward high-speed continuous motion
              const yProgress = ((progress * blk.speed + blk.offset) % 1);
              const curY = -height * 0.4 + yProgress * (height * 1.8);
              const curX = blk.xPercent * width;

              // Fade in and out near ends
              const fadeAlpha = Math.sin(yProgress * Math.PI);
              const fill = blk.isCyan ? "#00f0ff" : "#8b5cf6";

              return (
                <g key={blk.id} opacity={fadeAlpha * blk.brightness}>
                  {/* Trailing luminous light tail */}
                  <rect
                    x={curX}
                    y={curY - blk.blockHeight}
                    width={blk.blockWidth}
                    height={blk.blockHeight}
                    fill={fill}
                    opacity={0.65}
                  />

                  {/* Intense sharp leading edge block */}
                  <rect
                    x={curX}
                    y={curY - 12}
                    width={blk.blockWidth}
                    height={14}
                    fill="#ffffff"
                    opacity={0.95}
                  />
                </g>
              );
            })}
          </g>
        </g>

        {/* Cinematic Vignette for Depth */}
        <radialGradient id="vignetteOverlay" cx="50%" cy="50%" r="55%">
          <stop offset="40%" stopColor="#000000" stopOpacity="0" />
          <stop offset="85%" stopColor="#000000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
        </radialGradient>
        <rect width={width} height={height} fill="url(#vignetteOverlay)" pointerEvents="none" />
      </svg>
    </div>
  );
};
