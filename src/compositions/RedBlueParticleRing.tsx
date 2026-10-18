import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface RedBlueRingProps {
  particleCount?: number;
}

interface RingParticle {
  angleOffset: number;
  radiusOffset: number;
  zOffset: number;
  speed: number;
  size: number;
  isRed: boolean;
  pulsePhase: number;
}

export const RedBlueParticleRing: React.FC<RedBlueRingProps> = ({
  particleCount = 1600,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const particlesRef = useRef<RingParticle[] | null>(null);

  if (!particlesRef.current) {
    const list: RingParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      list.push({
        angleOffset: (i / particleCount) * Math.PI * 2,
        radiusOffset: (Math.random() - 0.5) * 110,
        zOffset: (Math.random() - 0.5) * 180,
        speed: 0.8 + Math.random() * 0.6,
        size: 2.2 + Math.random() * 4.5,
        isRed: i % 2 === 0, // 50% Fiery Crimson, 50% Electric Blue
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = list;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Deep Dark Cyber Void
    ctx.fillStyle = "#020206";
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const baseRadius = width * 0.28;

    const loopProgress = (frame / durationInFrames) * Math.PI * 2;

    ctx.globalCompositeOperation = "screen";

    // 1. Central Ambient Energy Glow
    const coreGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, baseRadius * 1.3);
    coreGlow.addColorStop(0, "rgba(255, 255, 255, 0.25)");
    coreGlow.addColorStop(0.3, "rgba(239, 68, 68, 0.15)");
    coreGlow.addColorStop(0.6, "rgba(6, 182, 212, 0.15)");
    coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, width, height);

    const particles = particlesRef.current!;

    // 2. Render 1,600+ Dual-Colored Vortex Particles in 3D Toroidal Rotation
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Dual rotation: Red revolves clockwise, Blue counter-clockwise or phase-shifted
      const direction = p.isRed ? 1 : -1;
      const angle = p.angleOffset + loopProgress * direction * p.speed;

      // 3D Toroidal helix displacement
      const helixWave = Math.sin(angle * 4 + loopProgress * 2) * 45;
      const r = baseRadius + p.radiusOffset + helixWave;

      // 3D perspective projection with slight tilt
      const x3d = Math.cos(angle) * r;
      const y3d = Math.sin(angle) * r * 0.72; // perspective tilt
      const z3d = p.zOffset + Math.sin(angle * 2) * 60;

      const pers = 600 / (600 + z3d);
      const sx = centerX + x3d * pers;
      const sy = centerY + y3d * pers;
      const sRadius = p.size * pers;

      // Pulse / flicker
      const pulse = Math.sin(frame * 0.15 + p.pulsePhase) * 0.3 + 0.7;
      const alpha = Math.min(1.0, (pers * 0.8) * pulse);

      const coreColor = p.isRed ? "rgba(254, 202, 202, 0.95)" : "rgba(224, 242, 254, 0.95)";
      const glowColor = p.isRed ? `rgba(239, 68, 68, ${alpha})` : `rgba(6, 182, 212, ${alpha})`;
      const outerHalo = p.isRed ? `rgba(185, 28, 28, ${alpha * 0.4})` : `rgba(37, 99, 235, ${alpha * 0.4})`;

      const pGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sRadius * 2.8);
      pGrad.addColorStop(0, coreColor);
      pGrad.addColorStop(0.35, glowColor);
      pGrad.addColorStop(0.75, outerHalo);
      pGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, sRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, particleCount]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#020206",
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
