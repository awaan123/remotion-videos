import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface RisingSmokeProps {
  plumeCount?: number;
  puffCount?: number;
}

export const RisingSmokeFog: React.FC<RisingSmokeProps> = ({
  plumeCount = 18,
  puffCount = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Loop parameter
  const progress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = progress * Math.PI * 2;

  // Pre-generate main rising smoke columns
  const plumes = useMemo(() => {
    return Array.from({ length: plumeCount }).map((_, i) => {
      const baseX = width * 0.2 + (i / plumeCount) * (width * 0.6) + Math.sin(i * 4.3) * 120;
      const widthSpread = 220 + ((i * 47) % 260);
      const speed = 0.8 + ((i * 11) % 6) * 0.2;
      const phase = (i * 2.39) % (Math.PI * 2);
      const swirlDir = i % 2 === 0 ? 1 : -1;
      return { id: i, baseX, widthSpread, speed, phase, swirlDir };
    });
  }, [plumeCount, width]);

  // Pre-generate volumetric cloud puffs
  const puffs = useMemo(() => {
    return Array.from({ length: puffCount }).map((_, i) => {
      const startX = width * 0.15 + (Math.sin(i * 13.7) * 0.5 + 0.5) * (width * 0.7);
      const startY = height * 1.1;
      const speedY = 0.6 + ((i * 17) % 15) * 0.08;
      const baseRadius = 80 + ((i * 23) % 140);
      const maxRadius = baseRadius * (2.5 + ((i * 7) % 5) * 0.4);
      const phase = (i * 4.13) % (Math.PI * 2);
      const driftSpeed = 30 + ((i * 19) % 60);
      const opacityMax = 0.12 + ((i * 29) % 20) * 0.008;

      return {
        id: i,
        startX,
        startY,
        speedY,
        baseRadius,
        maxRadius,
        phase,
        driftSpeed,
        opacityMax,
      };
    });
  }, [puffCount, width, height]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#000000",
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
          <filter id="smokeBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="55" />
          </filter>
          <filter id="heavyFogBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="95" />
          </filter>

          <radialGradient id="smokePuffGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0f4f8" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#cbd5e1" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#64748b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Rising Fog Density Layer */}
        <g filter="url(#heavyFogBlur)" opacity={0.65}>
          {plumes.map((p) => {
            const sway = Math.sin(loopAngle * p.speed + p.phase) * 140 * p.swirlDir;
            const topX = p.baseX + sway;
            return (
              <path
                key={p.id}
                d={`
                  M ${p.baseX - p.widthSpread * 0.5} ${height + 100}
                  Q ${p.baseX + sway * 0.5} ${height * 0.5}, ${topX} -100
                  Q ${p.baseX + p.widthSpread * 0.5} ${height * 0.5}, ${p.baseX + p.widthSpread * 0.5} ${height + 100}
                  Z
                `}
                fill="#94a3b8"
                opacity={0.18}
              />
            );
          })}
        </g>

        {/* Volumetric Billowing Smoke Puffs */}
        <g filter="url(#smokeBlur)">
          {puffs.map((puff) => {
            // Normalized cycle progress
            const puffProgress = ((progress * puff.speedY + puff.id / puffs.length) % 1);
            const currentY = height * 1.1 - puffProgress * (height * 1.3);
            const currentRadius =
              puff.baseRadius + puffProgress * (puff.maxRadius - puff.baseRadius);
            const drift =
              Math.sin(puffProgress * Math.PI * 2 * 1.5 + puff.phase) * puff.driftSpeed;
            const currentX = puff.startX + drift;

            // Fade in smoothly as it rises from bottom, fade out at top
            const fadeIn = Math.min(1, puffProgress / 0.15);
            const fadeOut = Math.max(0, 1 - puffProgress / 0.95);
            const alpha = fadeIn * fadeOut * puff.opacityMax;

            return (
              <circle
                key={puff.id}
                cx={currentX}
                cy={currentY}
                r={currentRadius}
                fill="url(#smokePuffGrad)"
                opacity={alpha}
              />
            );
          })}
        </g>
      </svg>

      {/* Subtle Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
