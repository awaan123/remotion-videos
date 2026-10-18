import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface TornPaperProps {
  stripCount?: number;
}

export const TornPaperGreenScreen: React.FC<TornPaperProps> = ({
  stripCount = 7,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Stop-motion quantization: hold each pose for 3 frames (10 fps feel)
  const steppedFrame = Math.floor(frame / 3) * 3;
  const progress = (steppedFrame % durationInFrames) / durationInFrames;

  // Pre-generate ragged torn paper strips
  const strips = useMemo(() => {
    return Array.from({ length: stripCount }).map((_, i) => {
      const startTrigger = (i / stripCount) * 0.7; // Sequential tearing
      const paperTone = i % 2 === 0 ? "#f8fafc" : "#e2e8f0";

      // Jagged edge vertices
      const pointCount = 28;
      const points = Array.from({ length: pointCount }).map((_, pIdx) => {
        const yFrac = pIdx / (pointCount - 1);
        const jaggedX = (Math.sin(pIdx * 7.1 + i * 3.4) * 25) + ((pIdx * 19) % 20);
        return { yFrac, jaggedX };
      });

      return {
        id: i,
        startTrigger,
        paperTone,
        points,
      };
    });
  }, [stripCount]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#00ff00", // Industry Standard Chroma Key Green
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
          {/* Realistic Paper Cast Shadow */}
          <filter id="paperShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="-10" dy="12" stdDeviation="15" floodColor="#000000" floodOpacity="0.45" />
          </filter>

          {/* Rough Paper Texture Gradient */}
          <linearGradient id="paperFiber" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Paper Layer peeling away to reveal Chroma Green Screen */}
        {strips.map((s, idx) => {
          // Tear progress for this individual strip
          const localProgress = Math.max(0, Math.min(1, (progress - s.startTrigger) / 0.35));
          // Rip displacement offset to the right
          const ripOffset = localProgress * (width * 1.2);
          const initialX = (idx / stripCount) * width;

          // Build SVG ragged polygon path
          const topX = initialX + ripOffset;
          const leftPath = s.points
            .map((p) => {
              const ptY = p.yFrac * height;
              const ptX = topX + p.jaggedX;
              return `${ptX},${ptY}`;
            })
            .join(" L ");

          const nextTopX = ((idx + 1) / stripCount) * width + ripOffset * 0.8;
          const pathD = `
            M ${topX} 0
            L ${leftPath}
            L ${width * 1.5} ${height}
            L ${width * 1.5} 0
            Z
          `;

          // If fully pulled away, hide
          if (localProgress >= 1) return null;

          return (
            <g key={s.id} filter="url(#paperShadow)">
              <path
                d={pathD}
                fill={s.paperTone}
                stroke="#ffffff"
                strokeWidth={5}
                strokeLinejoin="round"
              />
              {/* Fibrous edge highlight along the tear line */}
              <polyline
                points={leftPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth={7}
                strokeDasharray="4 2"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
