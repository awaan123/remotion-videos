import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface OpticalFiberProps {
  fiberCount?: number;
  pulseCount?: number;
}

export const OpticalFiberParticles: React.FC<OpticalFiberProps> = ({
  fiberCount = 38,
  pulseCount = 140,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const progress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = progress * Math.PI * 2;

  // Pre-generate curved optical fiber lines
  const fibers = useMemo(() => {
    return Array.from({ length: fiberCount }).map((_, i) => {
      // Perspective origin (focal convergence point)
      const startX = width * 0.15 + (i / fiberCount) * (width * 0.2);
      const startY = height * 0.95 + Math.sin(i * 3.7) * 40;

      // Spreading curved termination points (radiating outward)
      const endX = width * 0.35 + (i / fiberCount) * (width * 0.65);
      const endY = height * 0.08 + Math.sin(i * 5.2) * 160;

      // Control points for organic fiber bundle sweep
      const cp1X = startX + (endX - startX) * 0.35 + Math.sin(i * 2.1) * 180;
      const cp1Y = startY - 300 + Math.cos(i * 2.7) * 80;
      const cp2X = startX + (endX - startX) * 0.7 - Math.sin(i * 1.9) * 150;
      const cp2Y = endY + 220 + Math.sin(i * 3.3) * 60;

      const colorScheme = i % 3; // 0: Cyan, 1: Electric Blue, 2: Magenta / Purple
      const strokeColor =
        colorScheme === 0
          ? "#00f0ff"
          : colorScheme === 1
          ? "#3a86ff"
          : "#d946ef";

      const coreGlow =
        colorScheme === 0
          ? "#70e000"
          : colorScheme === 1
          ? "#0077b6"
          : "#8338ec";

      return {
        id: i,
        startX,
        startY,
        endX,
        endY,
        cp1X,
        cp1Y,
        cp2X,
        cp2Y,
        strokeColor,
        coreGlow,
      };
    });
  }, [fiberCount, width, height]);

  // Pre-generate data pulses traveling along the fibers
  const pulses = useMemo(() => {
    return Array.from({ length: pulseCount }).map((_, i) => {
      const fiberIndex = i % fiberCount;
      const speed = 1.0 + ((i * 13) % 7) * 0.25;
      const offset = (i * 37) % 100 / 100;
      const pulseSize = 3.5 + ((i * 19) % 5);
      return { id: i, fiberIndex, speed, offset, pulseSize };
    });
  }, [pulseCount, fiberCount]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#03020c",
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
          <filter id="neonPulseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Dark Nebula Atmosphere */}
        <radialGradient id="fiberAtmosphere" cx="60%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <rect width={width} height={height} fill="url(#fiberAtmosphere)" />

        {/* Base Glass Fiber Strands */}
        {fibers.map((f) => {
          // Dynamic subtle waviness in the cables
          const subtleWave = Math.sin(loopAngle + f.id * 0.4) * 8;
          const pathD = `
            M ${f.startX} ${f.startY}
            C ${f.cp1X + subtleWave} ${f.cp1Y}, ${f.cp2X - subtleWave} ${f.cp2Y}, ${f.endX} ${f.endY}
          `;

          return (
            <g key={f.id}>
              {/* Outer faint sheath */}
              <path
                d={pathD}
                fill="none"
                stroke={f.strokeColor}
                strokeWidth={3.5}
                opacity={0.25}
                strokeLinecap="round"
              />
              {/* Core luminous channel */}
              <path
                d={pathD}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.2}
                opacity={0.65}
                strokeLinecap="round"
              />
              {/* Glowing tip termination emitter */}
              <circle
                cx={f.endX}
                cy={f.endY}
                r={6}
                fill="#ffffff"
                filter="url(#neonPulseGlow)"
              />
              <circle
                cx={f.endX}
                cy={f.endY}
                r={14}
                fill={f.strokeColor}
                opacity={0.7}
                filter="url(#neonPulseGlow)"
              />
            </g>
          );
        })}

        {/* High-Speed Transmitted Light Photons / Data Packets */}
        <g filter="url(#neonPulseGlow)">
          {pulses.map((p) => {
            const f = fibers[p.fiberIndex];
            const t = ((progress * p.speed + p.offset) % 1);

            // Cubic Bezier interpolation: B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;
            const t2 = t * t;
            const t3 = t2 * t;

            const px =
              mt3 * f.startX +
              3 * mt2 * t * f.cp1X +
              3 * mt * t2 * f.cp2X +
              t3 * f.endX;

            const py =
              mt3 * f.startY +
              3 * mt2 * t * f.cp1Y +
              3 * mt * t2 * f.cp2Y +
              t3 * f.endY;

            const pulseAlpha = Math.sin(t * Math.PI); // Fades in and out along path

            return (
              <circle
                key={p.id}
                cx={px}
                cy={py}
                r={p.pulseSize}
                fill="#ffffff"
                opacity={pulseAlpha * 0.9}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
