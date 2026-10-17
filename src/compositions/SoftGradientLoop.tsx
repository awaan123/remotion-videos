import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface SoftGradientProps {
  color1: string; // Magenta / Rose
  color2: string; // Electric Cyan / Blue
  color3: string; // Vivid Orange / Gold
  color4: string; // Deep Violet / Indigo
}

export const defaultGradientProps: SoftGradientProps = {
  color1: "#ec4899", // Magenta
  color2: "#06b6d4", // Cyan
  color3: "#f97316", // Warm Orange
  color4: "#8b5cf6", // Purple
};

export const SoftGradientLoop: React.FC<SoftGradientProps> = ({
  color1 = defaultGradientProps.color1,
  color2 = defaultGradientProps.color2,
  color3 = defaultGradientProps.color3,
  color4 = defaultGradientProps.color4,
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

    // Dark sleek backdrop
    ctx.fillStyle = "#070913";
    ctx.fillRect(0, 0, width, height);

    const phase = (frame / durationInFrames) * Math.PI * 2;

    // 4 Fluid Harmonic Orbs rendered via GPU-accelerated radial gradients
    const orbs = [
      {
        x: width * 0.35 + Math.sin(phase) * (width * 0.22),
        y: height * 0.35 + Math.cos(phase) * (height * 0.2),
        radius: width * 0.45,
        color: color1,
      },
      {
        x: width * 0.68 + Math.cos(phase + 1) * (width * 0.2),
        y: height * 0.65 + Math.sin(phase + 1) * (height * 0.22),
        radius: width * 0.5,
        color: color2,
      },
      {
        x: width * 0.5 + Math.sin(phase * 2) * (width * 0.18),
        y: height * 0.5 + Math.cos(phase * 2) * (height * 0.16),
        radius: width * 0.42,
        color: color3,
      },
      {
        x: width * 0.22 + Math.cos(phase) * (width * 0.12),
        y: height * 0.78 + Math.sin(phase) * (height * 0.12),
        radius: width * 0.46,
        color: color4,
      },
    ];

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const orb of orbs) {
      const grad = ctx.createRadialGradient(
        orb.x,
        orb.y,
        orb.radius * 0.05,
        orb.x,
        orb.y,
        orb.radius
      );
      grad.addColorStop(0, orb.color + "dd");
      grad.addColorStop(0.5, orb.color + "55");
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Subtle edge vignette
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.35,
      width / 2,
      height / 2,
      width * 0.72
    );
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(2, 3, 8, 0.75)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, [frame, width, height, durationInFrames, color1, color2, color3, color4]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
