import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface HyperspaceProps {
  starCount: number;
  primaryColor: string; // e.g. "#60a5fa" (Blue)
  accentColor: string; // e.g. "#e0e7ff" (White)
  speed: number;
}

export const defaultHyperspaceProps: HyperspaceProps = {
  starCount: 350,
  primaryColor: "#38bdf8",
  accentColor: "#ffffff",
  speed: 1,
};

export const HyperspaceWarp: React.FC<HyperspaceProps> = ({
  starCount = defaultHyperspaceProps.starCount,
  primaryColor = defaultHyperspaceProps.primaryColor,
  accentColor = defaultHyperspaceProps.accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Deep Cosmic Void
    ctx.fillStyle = "#010206";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const loopProgress = (frame % durationInFrames) / durationInFrames;

    // Distant galaxy core glow
    const coreGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 220);
    coreGlow.addColorStop(0, primaryColor + "88");
    coreGlow.addColorStop(0.4, primaryColor + "22");
    coreGlow.addColorStop(1, "transparent");
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, width, height);

    // Render 3D Streaking Stars (Hyperspace warp speed jump)
    for (let i = 0; i < starCount; i++) {
      // Deterministic angle & initial distance
      const angle = (Math.sin(i * 787) * 0.5 + 0.5) * Math.PI * 2;
      const baseDistance = (Math.cos(i * 313) * 0.5 + 0.5) * 80 + 10;

      // Z-depth progression across loop
      const p = ((i / starCount + loopProgress) % 1);
      const zScale = Math.pow(p, 3.2); // Exponential acceleration toward camera

      if (zScale < 0.01) continue;

      const maxRadius = Math.max(width, height) * 0.85;
      const currentDist = baseDistance + zScale * maxRadius;
      const streakLength = Math.min(220, zScale * 260);

      const x2 = centerX + Math.cos(angle) * currentDist;
      const y2 = centerY + Math.sin(angle) * currentDist;
      const x1 = centerX + Math.cos(angle) * Math.max(0, currentDist - streakLength);
      const y1 = centerY + Math.sin(angle) * Math.max(0, currentDist - streakLength);

      const alpha = Math.min(1, Math.pow(p, 0.9));
      const lineWidth = Math.max(1.2, zScale * 6);

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.7, primaryColor);
      grad.addColorStop(1, accentColor);

      ctx.save();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = grad;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 12 * zScale;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.restore();
    }
  }, [frame, width, height, durationInFrames, starCount, primaryColor, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
