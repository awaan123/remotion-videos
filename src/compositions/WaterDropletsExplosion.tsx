import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface WaterDropletsProps {
  dropletCount: number;
  burstSpeed: number;
}

export const defaultWaterDropletsProps: WaterDropletsProps = {
  dropletCount: 380,
  burstSpeed: 1.2,
};

export const WaterDropletsExplosion: React.FC<WaterDropletsProps> = ({
  dropletCount = defaultWaterDropletsProps.dropletCount,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pure isolated black background for easy Screen/Add compositing or alpha use
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Slow-motion burst physics curve (quick initial explosion, sustained slow-mo float)
    const progress = (frame % durationInFrames) / durationInFrames;
    const slowMoTime = Math.pow(progress, 0.65); // Air drag / slow motion deceleration curve

    for (let i = 0; i < dropletCount; i++) {
      // Deterministic spherical distribution (Fibonacci sphere / polar)
      const theta = (Math.sin(i * 433) * 0.5 + 0.5) * Math.PI * 2;
      const phi = (Math.cos(i * 823) * 0.5 + 0.5) * Math.PI;
      const initialSpeed = (Math.sin(i * 197) * 0.5 + 0.5) * 1.4 + 0.6;
      const baseSize = (Math.cos(i * 571) * 0.5 + 0.5) * 14 + 4;

      // 3D trajectory
      const dirX = Math.sin(phi) * Math.cos(theta);
      const dirY = Math.sin(phi) * Math.sin(theta);
      const dirZ = Math.cos(phi); // Towards or away from camera (-1 to 1)

      // Perspective projection
      const dist = slowMoTime * initialSpeed * Math.max(width, height) * 0.95;
      const zPos = 300 - dirZ * dist * 0.85; // Move towards camera

      if (zPos <= 20) continue; // Clipped behind camera lens

      const perspective = 700 / zPos;
      const screenX = centerX + dirX * dist * perspective;
      const screenY = centerY + dirY * dist * perspective;
      const radius = baseSize * perspective;

      if (
        screenX < -radius ||
        screenX > width + radius ||
        screenY < -radius ||
        screenY > height + radius
      ) {
        continue;
      }

      // Draw Glassy Water Droplet
      ctx.save();

      // Specular highlight and refraction gradient
      const dropletGrad = ctx.createRadialGradient(
        screenX - radius * 0.35,
        screenY - radius * 0.35,
        radius * 0.05,
        screenX,
        screenY,
        radius
      );
      dropletGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)"); // Pure white specular glint
      dropletGrad.addColorStop(0.2, "rgba(200, 230, 255, 0.75)"); // Subtle sky refraction
      dropletGrad.addColorStop(0.6, "rgba(100, 160, 220, 0.3)"); // Water body transparency
      dropletGrad.addColorStop(0.85, "rgba(220, 240, 255, 0.6)"); // Caustic refraction rim
      dropletGrad.addColorStop(1, "rgba(255, 255, 255, 0.8)"); // Crisp outer meniscus rim

      ctx.fillStyle = dropletGrad;
      ctx.beginPath();
      ctx.arc(screenX, screenY, Math.max(1, radius), 0, Math.PI * 2);
      ctx.fill();

      // Secondary internal glass highlight (Fresnel reflection)
      if (radius > 8) {
        ctx.beginPath();
        ctx.ellipse(
          screenX - radius * 0.3,
          screenY - radius * 0.3,
          radius * 0.25,
          radius * 0.12,
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
      }

      ctx.restore();
    }
  }, [frame, width, height, durationInFrames, dropletCount]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
