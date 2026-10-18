import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface ThickSmokeProps {
  clusterCount?: number;
}

export const ThickSmokeFireFog: React.FC<ThickSmokeProps> = ({
  clusterCount = 42,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const progress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = progress * Math.PI * 2;

  // Pre-generate dense smoke clouds with subtle ember core
  const clusters = useMemo(() => {
    return Array.from({ length: clusterCount }).map((_, i) => {
      const startX = width * 0.1 + (i / clusterCount) * (width * 0.8) + Math.sin(i * 5.1) * 90;
      const startY = height * 1.05;
      const speedY = 0.5 + ((i * 13) % 9) * 0.08;
      const baseR = 120 + ((i * 31) % 160);
      const phase = (i * 3.7) % (Math.PI * 2);
      const isFireLit = i % 5 === 0;

      return {
        id: i,
        startX,
        startY,
        speedY,
        baseR,
        phase,
        isFireLit,
      };
    });
  }, [clusterCount, width, height]);

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
          <filter id="denseFogBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="65" />
          </filter>

          <radialGradient id="denseSmokeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#475569" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#1e293b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="fireLitSmokeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7b00" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#d00000" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#370617" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Churning Thick Smoke & Fiery Fog Clouds */}
        <g filter="url(#denseFogBlur)">
          {clusters.map((c) => {
            const cProg = ((progress * c.speedY + c.id / clusters.length) % 1);
            const curY = height * 1.05 - cProg * (height * 1.25);
            const curR = c.baseR * (1 + cProg * 1.8);
            const sway = Math.sin(cProg * Math.PI * 3 + c.phase) * 80;
            const curX = c.startX + sway;

            const fadeIn = Math.min(1, cProg / 0.12);
            const fadeOut = Math.max(0, 1 - cProg / 0.95);
            const alpha = fadeIn * fadeOut * 0.45;

            return (
              <circle
                key={c.id}
                cx={curX}
                cy={curY}
                r={curR}
                fill={c.isFireLit ? "url(#fireLitSmokeGrad)" : "url(#denseSmokeGrad)"}
                opacity={alpha}
                style={{ mixBlendMode: c.isFireLit ? "screen" : "normal" }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
