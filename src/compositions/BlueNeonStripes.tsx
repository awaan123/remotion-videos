import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface NeonStripesProps {
  stripeCount: number;
  primaryColor: string; // Electric Cyan Blue
  secondaryColor: string; // Royal Blue
  speed: number;
}

export const defaultNeonStripesProps: NeonStripesProps = {
  stripeCount: 22,
  primaryColor: "#00f2fe",
  secondaryColor: "#2563eb",
  speed: 1,
};

export const BlueNeonStripes: React.FC<NeonStripesProps> = ({
  stripeCount = defaultNeonStripesProps.stripeCount,
  primaryColor = defaultNeonStripesProps.primaryColor,
  secondaryColor = defaultNeonStripesProps.secondaryColor,
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

    // Deep Dark Blue High-Tech Studio Backdrop
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#030612");
    bg.addColorStop(0.5, "#060c20");
    bg.addColorStop(1, "#02040a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const loopProgress = (frame % durationInFrames) / durationInFrames;
    const angle = -Math.PI / 6; // 30-degree diagonal angle

    ctx.save();
    // Rotate canvas around center to achieve clean diagonal flow
    ctx.translate(width / 2, height / 2);
    ctx.rotate(angle);

    const span = Math.max(width, height) * 2;

    for (let i = 0; i < stripeCount; i++) {
      // Deterministic layout with loop progress
      const p = ((i / stripeCount + loopProgress * 1.5) % 1);
      const yPos = -span / 2 + p * span;
      const length = ((Math.sin(i * 311) * 0.5 + 0.5) * 0.5 + 0.5) * span * 0.8;
      const xOffset = Math.sin(i * 719) * (span * 0.2);
      const stripeHeight = ((Math.cos(i * 127) * 0.5 + 0.5) * 8 + 3);
      const alpha = Math.sin(p * Math.PI) * 0.95; // Fade in and out at edges

      const grad = ctx.createLinearGradient(xOffset - length / 2, 0, xOffset + length / 2, 0);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.2, secondaryColor + "88");
      grad.addColorStop(0.5, "#ffffff"); // Intense bright neon core
      grad.addColorStop(0.8, primaryColor);
      grad.addColorStop(1, "transparent");

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = grad;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = stripeHeight * 3.5;

      // Draw glowing light beam rounded bar
      ctx.beginPath();
      ctx.roundRect(xOffset - length / 2, yPos, length, stripeHeight, stripeHeight / 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();

    // Cinematic Lens Vignette
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.35,
      width / 2,
      height / 2,
      width * 0.72
    );
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(1, 2, 8, 0.75)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, [frame, width, height, durationInFrames, stripeCount, primaryColor, secondaryColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
