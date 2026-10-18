import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface DarkLiquidProps {
  rippleRings?: number;
  centerCount?: number;
}

export const DarkLiquidRipples: React.FC<DarkLiquidProps> = ({
  rippleRings = 32,
  centerCount = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const progress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = progress * Math.PI * 2;

  // Concentric ripple centers
  const centers = useMemo(() => {
    return [
      { id: 0, x: width * 0.5, y: height * 0.52, waveSpeed: 1.0, maxR: 1600 },
      { id: 1, x: width * 0.28, y: height * 0.38, waveSpeed: 0.9, maxR: 1200 },
      { id: 2, x: width * 0.72, y: height * 0.65, waveSpeed: 1.1, maxR: 1300 },
    ];
  }, [width, height]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#08090b",
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
          <filter id="softSpecular" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Deep Metallic Fresnel Surface Gradient */}
          <radialGradient id="liquidBase" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#1e2229" />
            <stop offset="45%" stopColor="#0f1115" />
            <stop offset="85%" stopColor="#050608" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Liquid Specular Rim Light */}
          <linearGradient id="specularRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#64748b" stopOpacity="0.15" />
            <stop offset="80%" stopColor="#1e293b" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base Obsidian Fluid Canvas */}
        <rect width={width} height={height} fill="url(#liquidBase)" />

        {/* Radiating Concentric Ripple Rings */}
        {centers.map((c) => {
          return (
            <g key={c.id} filter="url(#softSpecular)">
              {Array.from({ length: rippleRings }).map((_, rIdx) => {
                const ringOffset = (rIdx / rippleRings);
                const currentProgress = ((progress * c.waveSpeed + ringOffset) % 1);
                const radius = currentProgress * c.maxR;

                // Wave amplitude peaks in middle and dampens near edges
                const envelope = Math.sin(currentProgress * Math.PI);
                const strokeWidth = 2.5 + envelope * 6;
                const opacity = envelope * (c.id === 0 ? 0.35 : 0.2);

                // Subtle organic ripple distortion
                const waveDeform = Math.sin(loopAngle + rIdx * 0.5) * 6;

                return (
                  <ellipse
                    key={rIdx}
                    cx={c.x}
                    cy={c.y}
                    rx={radius + waveDeform}
                    ry={(radius + waveDeform) * 0.58} // 3D perspective tilt
                    fill="none"
                    stroke="url(#specularRim)"
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Polished Surface Sheen Highlight */}
        <ellipse
          cx={width * 0.45}
          cy={height * 0.45}
          rx={width * 0.35}
          ry={height * 0.25}
          fill="url(#specularRim)"
          opacity={0.35}
          style={{ mixBlendMode: "screen" }}
        />
      </svg>

      {/* Elegant Studio Lighting Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.95) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
