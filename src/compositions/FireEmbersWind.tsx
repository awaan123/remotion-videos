import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface FireEmbersProps {
  particleCount?: number;
}

interface Ember {
  x: number;
  y: number;
  z: number; // 0.1 (far) to 1.0 (foreground)
  baseSize: number;
  speedMultiplier: number;
  phase: number;
  freq: number;
  heat: number; // 1.0 = white hot, 0.0 = deep red
  coolingRate: number;
}

export const FireEmbersWind: React.FC<FireEmbersProps> = ({
  particleCount = 500,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const embersRef = useRef<Ember[] | null>(null);
  if (!embersRef.current) {
    const embers: Ember[] = [];
    for (let i = 0; i < particleCount; i++) {
      const z = 0.15 + Math.random() * 0.85;
      embers.push({
        x: Math.random() * (width * 1.5) - width * 0.25,
        y: Math.random() * (height * 1.4),
        z,
        baseSize: (3 + Math.random() * 7) * (z * 1.6),
        speedMultiplier: (1.5 + Math.random() * 2.5) * (0.8 + z * 0.7),
        phase: Math.random() * Math.PI * 2,
        freq: 0.02 + Math.random() * 0.03,
        heat: 0.4 + Math.random() * 0.6,
        coolingRate: 0.003 + Math.random() * 0.005,
      });
    }
    // Sort by depth
    embers.sort((a, b) => a.z - b.z);
    embersRef.current = embers;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Deep Burning Infernal Atmosphere
    const bgGrad = ctx.createRadialGradient(
      width * 0.35,
      height * 0.85,
      width * 0.1,
      width * 0.5,
      height * 0.6,
      width * 0.85
    );
    bgGrad.addColorStop(0, "#450a0a"); // Molten dark red
    bgGrad.addColorStop(0.35, "#1f0303"); // Deep ember shadow
    bgGrad.addColorStop(0.75, "#0b0101"); // Charred black
    bgGrad.addColorStop(1, "#000000"); // Pure void black
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Infernal Glow Core & Heat Waves
    ctx.globalCompositeOperation = "screen";
    const bottomGlow = ctx.createLinearGradient(0, height, 0, height * 0.4);
    const flicker = Math.sin(frame * 0.1) * 0.05 + Math.cos(frame * 0.23) * 0.03;
    bottomGlow.addColorStop(0, `rgba(234, 88, 12, ${0.45 + flicker})`); // Fiery orange
    bottomGlow.addColorStop(0.5, `rgba(185, 28, 28, ${0.25 + flicker})`); // Crimson
    bottomGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bottomGlow;
    ctx.fillRect(0, height * 0.4, width, height * 0.6);

    // 3. Render 3D Flying Sparks & Embers with Motion-Blurred Trails
    const embers = embersRef.current!;
    const totalW = width * 1.5;
    const totalH = height * 1.4;

    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];

      // Wind physics: Strong diagonal drift from bottom-left to top-right
      const windX = (frame * (6 * e.speedMultiplier)) % totalW;
      const liftY = (frame * (3.8 * e.speedMultiplier)) % totalH;

      let cx = (e.x + windX) % totalW;
      let cy = (e.y - liftY + totalH) % totalH;

      // Turbulent curl displacement
      const turbTime = frame * e.freq + e.phase;
      const turbX = Math.sin(turbTime) * 35 * e.z;
      const turbY = Math.cos(turbTime * 1.3) * 25 * e.z;

      cx += turbX;
      cy += turbY;

      if (cx < -100 || cx > width + 150 || cy < -100 || cy > height + 150) continue;

      // Dynamic ember cooling & flickering
      const heatFlicker = Math.sin(frame * 0.15 + e.phase) * 0.15;
      const currentHeat = Math.max(0.1, Math.min(1.0, e.heat + heatFlicker));

      let coreColor: string;
      let glowColor: string;

      if (currentHeat > 0.8) {
        coreColor = "rgba(255, 255, 255, 0.98)";
        glowColor = "rgba(254, 240, 138, 0.85)"; // White-hot gold
      } else if (currentHeat > 0.45) {
        coreColor = "rgba(254, 215, 170, 0.95)";
        glowColor = "rgba(249, 115, 22, 0.8)"; // Fiery orange
      } else {
        coreColor = "rgba(252, 165, 165, 0.85)";
        glowColor = "rgba(220, 38, 38, 0.6)"; // Deep crimson ember
      }

      ctx.save();
      ctx.translate(cx, cy);

      if (e.z > 0.85) {
        // Foreground Out-of-Focus Burning Bokeh Disc
        const bRad = e.baseSize * 3.5;
        const bGrad = ctx.createRadialGradient(0, 0, bRad * 0.15, 0, 0, bRad);
        bGrad.addColorStop(0, "rgba(255, 247, 237, 0.6)");
        bGrad.addColorStop(0.35, "rgba(249, 115, 22, 0.35)");
        bGrad.addColorStop(0.7, "rgba(185, 28, 28, 0.15)");
        bGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(0, 0, bRad, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Crisp In-Focus Flying Spark with Velocity Motion Blur Capsule
        const speed = 6 * e.speedMultiplier;
        const trailLength = Math.min(50, speed * 2.5 * e.z);
        const trailAngle = Math.atan2(-3.8, 6); // Along velocity vector

        ctx.rotate(trailAngle);

        // Core bright trail
        const trailGrad = ctx.createLinearGradient(-trailLength, 0, e.baseSize, 0);
        trailGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
        trailGrad.addColorStop(0.6, glowColor);
        trailGrad.addColorStop(1, coreColor);

        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, trailLength, e.baseSize * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // High intensity head sparkle
        const headGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, e.baseSize * 2.5);
        headGrad.addColorStop(0, coreColor);
        headGrad.addColorStop(0.5, glowColor);
        headGrad.addColorStop(1, "rgba(249, 115, 22, 0)");
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(0, 0, e.baseSize * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000000",
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
