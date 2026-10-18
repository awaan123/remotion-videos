import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface OrionNebulaProps {
  starCount?: number;
  cloudCount?: number;
}

interface Star {
  x3d: number;
  y3d: number;
  z3d: number;
  baseRadius: number;
  color: string;
  twinklePhase: number;
  isGlint: boolean;
}

interface NebulaCloud {
  x3d: number;
  y3d: number;
  z3d: number;
  radius: number;
  color: string;
  alpha: number;
}

export const OrionNebulaFlythrough: React.FC<OrionNebulaProps> = ({
  starCount = 1400,
  cloudCount = 36,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sceneRef = useRef<{ stars: Star[]; clouds: NebulaCloud[] } | null>(null);

  if (!sceneRef.current) {
    const starColors = ["#ffffff", "#e0f2fe", "#fef3c7", "#fbcfe8", "#bae6fd"];
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x3d: (Math.random() - 0.5) * width * 3.5,
        y3d: (Math.random() - 0.5) * height * 3.5,
        z3d: Math.random() * 2000,
        baseRadius: 1.5 + Math.random() * 3.5,
        color: starColors[i % starColors.length],
        twinklePhase: Math.random() * Math.PI * 2,
        isGlint: i % 14 === 0,
      });
    }

    const cloudColors = [
      "rgba(192, 38, 211, ", // Vivid Magenta / Fuchsia
      "rgba(124, 58, 237, ", // Deep Cosmic Violet
      "rgba(14, 165, 233, ", // Electric Azure
      "rgba(6, 182, 212, ",  // Turquoise Cyan
      "rgba(249, 115, 22, ",  // Warm Stellar Amber
    ];

    const clouds: NebulaCloud[] = [];
    for (let c = 0; c < cloudCount; c++) {
      clouds.push({
        x3d: (Math.random() - 0.5) * width * 2.2,
        y3d: (Math.random() - 0.5) * height * 2.2,
        z3d: Math.random() * 2000,
        radius: 350 + Math.random() * 550,
        color: cloudColors[c % cloudColors.length],
        alpha: 0.12 + Math.random() * 0.18,
      });
    }

    sceneRef.current = { stars, clouds };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Deep Infinite Interstellar Black Backdrop
    ctx.fillStyle = "#010104";
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Continuous forward flight speed through cosmic volume
    const speed = 12;
    const maxZ = 2000;
    const flightZ = (frame * speed) % maxZ;

    const { stars, clouds } = sceneRef.current!;

    ctx.globalCompositeOperation = "screen";

    // 1. Render Volumetric Gaseous Nebula Dust Clouds
    for (let c = 0; c < clouds.length; c++) {
      const cloud = clouds[c];
      const curZ = ((cloud.z3d - flightZ + maxZ) % maxZ) + 50;
      const pers = 600 / curZ;
      const sx = centerX + cloud.x3d * pers;
      const sy = centerY + cloud.y3d * pers;
      const sRadius = cloud.radius * pers;

      if (sx < -sRadius || sx > width + sRadius || sy < -sRadius || sy > height + sRadius) continue;

      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sRadius);
      grad.addColorStop(0, `${cloud.color}${cloud.alpha * 1.5})`);
      grad.addColorStop(0.4, `${cloud.color}${cloud.alpha * 0.8})`);
      grad.addColorStop(0.8, `${cloud.color}${cloud.alpha * 0.2})`);
      grad.addColorStop(1, `${cloud.color}0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Render 1,400+ 3D Parallax Stars with Anamorphic Glints
    for (let s = 0; s < stars.length; s++) {
      const star = stars[s];
      const curZ = ((star.z3d - flightZ + maxZ) % maxZ) + 40;
      const pers = 650 / curZ;
      const sx = centerX + star.x3d * pers;
      const sy = centerY + star.y3d * pers;
      const sRadius = star.baseRadius * pers;

      if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) continue;

      // Twinkle calculation
      const twinkle = Math.sin(frame * 0.12 + star.twinklePhase) * 0.35 + 0.65;
      const alpha = Math.min(1.0, (1 - curZ / maxZ) * 1.4) * twinkle;

      // Draw star core
      const starGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(1, sRadius * 2.5));
      starGrad.addColorStop(0, star.color);
      starGrad.addColorStop(0.4, star.color.replace(")", `, ${alpha * 0.7})`));
      starGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = starGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(1, sRadius * 2.5), 0, Math.PI * 2);
      ctx.fill();

      // Anamorphic 4-point glint for bright hero proto-stars
      if (star.isGlint && curZ < 800) {
        const glintLen = sRadius * 7 * twinkle;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(sx - glintLen, sy);
        ctx.lineTo(sx + glintLen, sy);
        ctx.moveTo(sx, sy - glintLen);
        ctx.lineTo(sx, sy + glintLen);
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, starCount, cloudCount]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#010104",
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
