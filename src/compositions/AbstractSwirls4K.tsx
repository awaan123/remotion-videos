import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface SwirlsProps {
  armCount?: number;
}

export const AbstractSwirls4K: React.FC<SwirlsProps> = ({
  armCount = 18,
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

    // Deep Cosmic Midnight Gradient
    const bg = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      20,
      width * 0.5,
      height * 0.5,
      width * 0.8
    );
    bg.addColorStop(0, "#080616");
    bg.addColorStop(0.5, "#030209");
    bg.addColorStop(1, "#010004");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const loopProgress = (frame / durationInFrames) * Math.PI * 2;

    ctx.globalCompositeOperation = "screen";

    // Draw 3D Chromatic Spiral Swirls
    for (let a = 0; a < armCount; a++) {
      const armFraction = a / armCount;
      const baseAngle = armFraction * Math.PI * 2 + loopProgress;
      const points = 60;
      const maxRadius = Math.max(width, height) * 0.65;

      ctx.beginPath();

      for (let p = 0; p <= points; p++) {
        const pFrac = p / points;
        const radius = Math.pow(pFrac, 1.3) * maxRadius;
        const twistAngle = baseAngle + pFrac * Math.PI * 3.5 + Math.sin(loopProgress * 2 + a) * 0.2;

        const x = centerX + Math.cos(twistAngle) * radius;
        const y = centerY + Math.sin(twistAngle) * (radius * 0.85); // 3D tilt

        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Swirl colors across spectrum: Violet, Electric Cyan, Neon Magenta, Warm Amber
      const hue = (armFraction * 360 + frame * 0.4) % 360;
      const grad = ctx.createLinearGradient(centerX, centerY, width, height);
      grad.addColorStop(0, `hsla(${hue}, 100%, 75%, 0.9)`);
      grad.addColorStop(0.5, `hsla(${(hue + 45) % 360}, 95%, 60%, 0.6)`);
      grad.addColorStop(1, `hsla(${(hue + 90) % 360}, 90%, 50%, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(3, (1 - armFraction * 0.5) * 24);
      ctx.lineCap = "round";
      ctx.stroke();

      // Specular spine highlight
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, armCount]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#010004",
        overflow: "hidden",
      }}
    >
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
    </div>
  );
};
