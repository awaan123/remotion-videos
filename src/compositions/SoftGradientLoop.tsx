import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface SoftGradientProps {
  color1: string; // Magenta / Rose
  color2: string; // Electric Cyan / Blue
  color3: string; // Vivid Orange / Gold
  color4: string; // Deep Violet / Indigo
  blurAmount: number;
}

export const defaultGradientProps: SoftGradientProps = {
  color1: "#ec4899", // Magenta
  color2: "#06b6d4", // Cyan
  color3: "#f97316", // Warm Orange
  color4: "#8b5cf6", // Purple
  blurAmount: 140,
};

export const SoftGradientLoop: React.FC<SoftGradientProps> = ({
  color1 = defaultGradientProps.color1,
  color2 = defaultGradientProps.color2,
  color3 = defaultGradientProps.color3,
  color4 = defaultGradientProps.color4,
  blurAmount = defaultGradientProps.blurAmount,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Angular phase for a 100% flawless mathematical loop
  const phase = (frame / durationInFrames) * Math.PI * 2;

  // Blob 1: Lissajous orbit
  const b1X = width * 0.35 + Math.sin(phase) * (width * 0.2);
  const b1Y = height * 0.35 + Math.cos(phase) * (height * 0.2);
  const b1Scale = 1 + Math.sin(phase * 2) * 0.15;

  // Blob 2: Counter-orbit
  const b2X = width * 0.65 + Math.cos(phase + 1) * (width * 0.22);
  const b2Y = height * 0.65 + Math.sin(phase + 1) * (height * 0.22);
  const b2Scale = 1 + Math.cos(phase * 2) * 0.18;

  // Blob 3: Center pulse
  const b3X = width * 0.5 + Math.sin(phase * 2) * (width * 0.15);
  const b3Y = height * 0.5 + Math.cos(phase * 2) * (height * 0.15);

  // Blob 4: Corner drift
  const b4X = width * 0.2 + Math.cos(phase) * (width * 0.1);
  const b4Y = height * 0.8 + Math.sin(phase) * (height * 0.1);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#060913",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blurred Blob Layer */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          filter: `blur(${blurAmount}px) saturate(1.8)`,
          transform: "scale(1.2)", // Avoid edge clipping
        }}
      >
        {/* Blob 1 */}
        <div
          style={{
            position: "absolute",
            left: b1X,
            top: b1Y,
            width: width * 0.45,
            height: height * 0.45,
            borderRadius: "50%",
            background: color1,
            transform: `translate(-50%, -50%) scale(${b1Scale})`,
            opacity: 0.85,
          }}
        />

        {/* Blob 2 */}
        <div
          style={{
            position: "absolute",
            left: b2X,
            top: b2Y,
            width: width * 0.5,
            height: height * 0.5,
            borderRadius: "50%",
            background: color2,
            transform: `translate(-50%, -50%) scale(${b2Scale})`,
            opacity: 0.8,
          }}
        />

        {/* Blob 3 */}
        <div
          style={{
            position: "absolute",
            left: b3X,
            top: b3Y,
            width: width * 0.4,
            height: height * 0.4,
            borderRadius: "50%",
            background: color3,
            transform: "translate(-50%, -50%)",
            opacity: 0.75,
          }}
        />

        {/* Blob 4 */}
        <div
          style={{
            position: "absolute",
            left: b4X,
            top: b4Y,
            width: width * 0.42,
            height: height * 0.42,
            borderRadius: "50%",
            background: color4,
            transform: "translate(-50%, -50%)",
            opacity: 0.7,
          }}
        />
      </div>

      {/* Subtle Grain Overlay for Film Look */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
