import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface BrushStrokeProps {
  strokeCount?: number;
}

export const BrushStrokeTransition: React.FC<BrushStrokeProps> = ({
  strokeCount = 14,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const progress = (frame % durationInFrames) / durationInFrames;

  // Pre-generate dynamic textured brush strokes
  const strokes = useMemo(() => {
    return Array.from({ length: strokeCount }).map((_, i) => {
      const startTrigger = (i / strokeCount) * 0.55;
      const centerY = (i / strokeCount) * height + (Math.sin(i * 3.3) * 60);
      const strokeThickness = 120 + ((i * 41) % 110);
      const angleDeg = -8 + ((i * 17) % 16); // Dynamic tilt angle

      // Bristle jitter streaks
      const bristles = Array.from({ length: 12 }).map((__, bIdx) => {
        const offsetRatio = (bIdx - 6) / 6;
        const widthMod = 0.85 + ((bIdx * 7) % 5) * 0.06;
        return { offsetRatio, widthMod };
      });

      return {
        id: i,
        startTrigger,
        centerY,
        strokeThickness,
        angleDeg,
        bristles,
      };
    });
  }, [strokeCount, height]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#ffffff", // High Contrast Clean White Canvas
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
          <filter id="roughPaintEdge">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Dynamic Black Acrylic Ink Brush Strokes Slashing Across */}
        <g filter="url(#roughPaintEdge)">
          {strokes.map((s) => {
            const localProgress = Math.max(0, Math.min(1, (progress - s.startTrigger) / 0.32));
            const easeProgress = Math.min(1, Math.pow(localProgress, 1.4));
            const currentEndX = easeProgress * (width * 1.3) - width * 0.15;

            if (localProgress <= 0) return null;

            return (
              <g key={s.id}>
                {s.bristles.map((b, bIdx) => {
                  const bY = s.centerY + b.offsetRatio * (s.strokeThickness * 0.5);
                  return (
                    <line
                      key={bIdx}
                      x1={-width * 0.15}
                      y1={bY}
                      x2={currentEndX * b.widthMod}
                      y2={bY + (currentEndX / width) * Math.tan((s.angleDeg * Math.PI) / 180) * 120}
                      stroke="#050505"
                      strokeWidth={s.strokeThickness * 0.18}
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
