import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface CyberGridProps {
  primaryColor: string; // e.g., "#00f2fe"
  secondaryColor: string; // e.g., "#7928ca"
  speed: number;
  gridDensity: number;
  starCount: number;
}

export const defaultCyberGridProps: CyberGridProps = {
  primaryColor: "#00f2fe",
  secondaryColor: "#3b82f6",
  speed: 1,
  gridDensity: 32,
  starCount: 150,
};

export const CyberGrid: React.FC<CyberGridProps> = ({
  primaryColor = defaultCyberGridProps.primaryColor,
  secondaryColor = defaultCyberGridProps.secondaryColor,
  gridDensity = defaultCyberGridProps.gridDensity,
  starCount = defaultCyberGridProps.starCount,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset & clear
    ctx.clearRect(0, 0, width, height);

    // 1. Deep Space Tech Background Gradient
    const bgGradient = ctx.createRadialGradient(
      width / 2,
      height * 0.45,
      100,
      width / 2,
      height / 2,
      width * 0.75
    );
    bgGradient.addColorStop(0, "#080d1a");
    bgGradient.addColorStop(0.5, "#03060f");
    bgGradient.addColorStop(1, "#010206");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Horizon Glow (Center energy burst)
    const horizonY = height * 0.52;
    const horizonGlow = ctx.createRadialGradient(
      width / 2,
      horizonY,
      10,
      width / 2,
      horizonY,
      width * 0.45
    );
    horizonGlow.addColorStop(0, primaryColor + "bb");
    horizonGlow.addColorStop(0.3, secondaryColor + "44");
    horizonGlow.addColorStop(1, "transparent");
    ctx.fillStyle = horizonGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Floating Ambient Particles (Seamlessly looped via sin/cos)
    for (let i = 0; i < starCount; i++) {
      // Deterministic pseudo-random seed based on index
      const seedX = (Math.sin(i * 991) * 0.5 + 0.5) * width;
      const seedY = (Math.cos(i * 433) * 0.5 + 0.5) * (height * 0.65);
      const radius = (Math.sin(i * 123) * 0.5 + 0.5) * 3 + 1;

      // Angular seamless loop factor
      const phase = (frame / durationInFrames) * Math.PI * 2;
      const offsetY = Math.sin(phase + i) * 20;
      const alpha = (Math.sin(phase * 2 + i * 2) * 0.5 + 0.5) * 0.7 + 0.2;

      ctx.beginPath();
      ctx.arc(seedX, seedY + offsetY, radius, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 10;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;

    // 4. Perspective 3D Grid Floor
    ctx.save();
    ctx.lineWidth = 2.5;

    // Longitudinal lines (radiating from horizon vanishing point)
    const vanishingX = width / 2;
    const vanishingY = horizonY;
    const lineCount = gridDensity;

    for (let i = -lineCount; i <= lineCount; i++) {
      const spread = (i / lineCount) * (width * 1.6);
      const bottomX = width / 2 + spread;
      const bottomY = height;

      const lineGrad = ctx.createLinearGradient(vanishingX, vanishingY, bottomX, bottomY);
      lineGrad.addColorStop(0, primaryColor + "11");
      lineGrad.addColorStop(0.3, primaryColor + "aa");
      lineGrad.addColorStop(1, secondaryColor + "ff");

      ctx.strokeStyle = lineGrad;
      ctx.beginPath();
      ctx.moveTo(vanishingX, vanishingY);
      ctx.lineTo(bottomX, bottomY);
      ctx.stroke();
    }

    // Transverse lines (moving forward toward camera, looping seamlessly)
    const numHorizontalLines = 24;
    const loopProgress = (frame % (durationInFrames / 5)) / (durationInFrames / 5);

    for (let i = 0; i < numHorizontalLines; i++) {
      // Exponential perspective mapping
      const p = (i + loopProgress) / numHorizontalLines;
      const y = vanishingY + Math.pow(p, 2.2) * (height - vanishingY);

      if (y > vanishingY && y <= height) {
        const lineAlpha = Math.min(1, Math.pow(p, 1.5));
        ctx.strokeStyle = primaryColor;
        ctx.globalAlpha = lineAlpha * 0.85;
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 12 * p;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 5. Cinematic Vignette (Dark corners)
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.35,
      width / 2,
      height / 2,
      width * 0.72
    );
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.75)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, [frame, width, height, durationInFrames, primaryColor, secondaryColor, gridDensity, starCount]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
};
