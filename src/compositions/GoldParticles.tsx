import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface ParticleConfig {
  particleCount: number;
  bokehCount: number;
  primaryColor: string; // e.g. "#fbbf24" (Gold)
  accentColor: string; // e.g. "#fffbeb" (Warm white glow)
  glowSize: number;
}

export const defaultGoldParticleProps: ParticleConfig = {
  particleCount: 220,
  bokehCount: 35,
  primaryColor: "#f59e0b",
  accentColor: "#fef3c7",
  glowSize: 18,
};

export const GoldParticles: React.FC<ParticleConfig> = ({
  particleCount = defaultGoldParticleProps.particleCount,
  bokehCount = defaultGoldParticleProps.bokehCount,
  primaryColor = defaultGoldParticleProps.primaryColor,
  accentColor = defaultGoldParticleProps.accentColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background to pure cinematic deep space
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#020205";
    ctx.fillRect(0, 0, width, height);

    // Subtle bottom gold horizon glow (floor reflection)
    const floorGlow = ctx.createRadialGradient(
      width / 2,
      height * 0.95,
      50,
      width / 2,
      height * 0.95,
      width * 0.6
    );
    floorGlow.addColorStop(0, primaryColor + "22");
    floorGlow.addColorStop(1, "transparent");
    ctx.fillStyle = floorGlow;
    ctx.fillRect(0, 0, width, height);

    // 1. Large Defocused Bokeh Orbs (Background depth layer)
    for (let i = 0; i < bokehCount; i++) {
      const seedX = (Math.sin(i * 389) * 0.5 + 0.5) * width;
      const seedY = (Math.cos(i * 727) * 0.5 + 0.5) * height;
      const radius = (Math.sin(i * 47) * 0.5 + 0.5) * 45 + 20;

      // Vertical drift with seamless circular wrap
      const phase = (frame / durationInFrames) * Math.PI * 2;
      const driftY = (seedY - ((frame * 0.8 + i * 20) % height) + height) % height;
      const pulseAlpha = (Math.sin(phase * 2 + i) * 0.5 + 0.5) * 0.12 + 0.03;

      const grad = ctx.createRadialGradient(seedX, driftY, 0, seedX, driftY, radius);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(seedX, driftY, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.globalAlpha = pulseAlpha;
      ctx.fill();
    }

    // 2. Crisp Flickering Gold Star Dust (Foreground layer)
    for (let i = 0; i < particleCount; i++) {
      const seedX = (Math.sin(i * 919) * 0.5 + 0.5) * width;
      const seedY = (Math.cos(i * 613) * 0.5 + 0.5) * height;
      const radius = (Math.sin(i * 83) * 0.5 + 0.5) * 3 + 1;

      // Floating drift upwards (classic awards dust motion)
      const driftY = (seedY - ((frame * 1.5 + i * 15) % height) + height) % height;
      const driftX = seedX + Math.sin((frame / durationInFrames) * Math.PI * 4 + i) * 25;

      // Flicker intensity formula
      const flicker = (Math.sin((frame / durationInFrames) * Math.PI * 8 + i * 3) * 0.5 + 0.5) * 0.7 + 0.3;

      ctx.beginPath();
      ctx.arc(driftX, driftY, radius, 0, Math.PI * 2);
      ctx.fillStyle = i % 4 === 0 ? accentColor : primaryColor;
      ctx.globalAlpha = flicker;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 10;
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }, [frame, width, height, durationInFrames, particleCount, bokehCount, primaryColor, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
