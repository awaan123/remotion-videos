import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface NeonArrowsProps {
  arrowCount: number;
  primaryColor: string; // e.g. "#3b82f6" (Blue)
  secondaryColor: string; // e.g. "#a855f7" (Purple)
  speed: number;
}

export const defaultNeonArrowsProps: NeonArrowsProps = {
  arrowCount: 16,
  primaryColor: "#00f2fe",
  secondaryColor: "#ec4899",
  speed: 1,
};

export const NeonArrowsTunnel: React.FC<NeonArrowsProps> = ({
  arrowCount = defaultNeonArrowsProps.arrowCount,
  primaryColor = defaultNeonArrowsProps.primaryColor,
  secondaryColor = defaultNeonArrowsProps.secondaryColor,
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

    // Deep Dark Void Background
    const bg = ctx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      width * 0.7
    );
    bg.addColorStop(0, "#080614");
    bg.addColorStop(1, "#020107");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const loopProgress = (frame % (durationInFrames / 4)) / (durationInFrames / 4);

    // Center focal point glow
    const centerGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 180);
    centerGlow.addColorStop(0, primaryColor + "aa");
    centerGlow.addColorStop(0.5, secondaryColor + "44");
    centerGlow.addColorStop(1, "transparent");
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);

    // Draw tunnel arrows moving forward in 3D perspective
    for (let i = 0; i < arrowCount; i++) {
      // Perspective z-distribution
      const p = ((i + loopProgress) % arrowCount) / arrowCount;
      const zScale = Math.pow(p, 2.5); // Exponential perspective growth

      if (zScale < 0.02) continue;

      const arrowWidth = width * 0.65 * zScale;
      const arrowHeight = height * 0.35 * zScale;
      const chevronDepth = arrowHeight * 0.75;
      const lineWidth = Math.max(2, 14 * zScale);
      const alpha = Math.min(1, Math.pow(p, 1.2));

      // Color interpolation along depth
      const grad = ctx.createLinearGradient(
        centerX - arrowWidth / 2,
        centerY,
        centerX + arrowWidth / 2,
        centerY
      );
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(0.5, secondaryColor);
      grad.addColorStop(1, primaryColor);

      ctx.save();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = grad;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = p > 0.5 ? primaryColor : secondaryColor;
      ctx.shadowBlur = 25 * zScale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Draw Top Chevron Arrow (> pointing into screen, or < pointing towards viewer)
      ctx.beginPath();
      ctx.moveTo(centerX - arrowWidth / 2, centerY - arrowHeight / 2 + chevronDepth);
      ctx.lineTo(centerX, centerY - arrowHeight / 2);
      ctx.lineTo(centerX + arrowWidth / 2, centerY - arrowHeight / 2 + chevronDepth);
      ctx.stroke();

      // Draw Bottom Mirror Chevron Arrow
      ctx.beginPath();
      ctx.moveTo(centerX - arrowWidth / 2, centerY + arrowHeight / 2 - chevronDepth);
      ctx.lineTo(centerX, centerY + arrowHeight / 2);
      ctx.lineTo(centerX + arrowWidth / 2, centerY + arrowHeight / 2 - chevronDepth);
      ctx.stroke();

      ctx.restore();
    }

    // Vignette
    const vignette = ctx.createRadialGradient(
      centerX,
      centerY,
      width * 0.3,
      centerX,
      centerY,
      width * 0.75
    );
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.8)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, [frame, width, height, durationInFrames, arrowCount, primaryColor, secondaryColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
