import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface PlasmaRingProps {
  particleCount?: number;
}

interface PlasmaSparks {
  angle: number;
  radialDist: number;
  speed: number;
  size: number;
  phase: number;
}

export const PlasmaRing3D: React.FC<PlasmaRingProps> = ({
  particleCount = 900,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sparksRef = useRef<PlasmaSparks[] | null>(null);

  if (!sparksRef.current) {
    const list: PlasmaSparks[] = [];
    for (let i = 0; i < particleCount; i++) {
      list.push({
        angle: Math.random() * Math.PI * 2,
        radialDist: (Math.random() - 0.5) * 80,
        speed: 0.6 + Math.random() * 0.8,
        size: 2 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    sparksRef.current = list;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Deep Dark Void
    ctx.fillStyle = "#010105";
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const ringRadius = width * 0.26;

    const loopProgress = (frame / durationInFrames) * Math.PI * 2;

    ctx.globalCompositeOperation = "screen";

    // 1. Central Ambient Coronal Glow
    const coreGlow = ctx.createRadialGradient(centerX, centerY, ringRadius * 0.2, centerX, centerY, ringRadius * 1.6);
    coreGlow.addColorStop(0, "rgba(245, 158, 11, 0.15)");
    coreGlow.addColorStop(0.5, "rgba(234, 88, 12, 0.2)");
    coreGlow.addColorStop(0.85, "rgba(168, 85, 247, 0.12)");
    coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, width, height);

    // 2. High-Energy Turbulent Plasma Toroid Ribbons (16 undulating coronal loops)
    const loopSegments = 120;
    for (let layer = 0; layer < 12; layer++) {
      ctx.beginPath();
      const layerOffset = (layer / 12) * Math.PI * 2;
      const layerSpeed = 1.0 + (layer % 3) * 0.3;

      for (let s = 0; s <= loopSegments; s++) {
        const theta = (s / loopSegments) * Math.PI * 2;
        // Multi-frequency harmonic plasma wave distortion
        const wave1 = Math.sin(theta * 6 + loopProgress * 3 * layerSpeed + layerOffset) * 25;
        const wave2 = Math.cos(theta * 9 - loopProgress * 2 + layer) * 15;
        const r = ringRadius + wave1 + wave2;

        const x = centerX + Math.cos(theta) * r;
        const y = centerY + Math.sin(theta) * (r * 0.75); // 3D perspective tilt

        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Ionized Plasma Color Cycling: Solar Gold, Hot Orange, Electric Violet
      const isViolet = layer % 3 === 0;
      const alpha = 0.35 + Math.sin(loopProgress * 2 + layer) * 0.15;

      const grad = ctx.createLinearGradient(0, centerY - ringRadius, 0, centerY + ringRadius);
      if (isViolet) {
        grad.addColorStop(0, `rgba(192, 132, 252, ${alpha * 0.9})`);
        grad.addColorStop(0.5, `rgba(236, 72, 153, ${alpha * 0.7})`);
        grad.addColorStop(1, `rgba(59, 130, 246, ${alpha * 0.5})`);
      } else {
        grad.addColorStop(0, `rgba(254, 240, 138, ${alpha})`); // White-gold core
        grad.addColorStop(0.5, `rgba(249, 115, 22, ${alpha * 0.85})`); // Solar Orange
        grad.addColorStop(1, `rgba(220, 38, 38, ${alpha * 0.6})`); // Coronal Red
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = 4 + (layer % 4) * 6;
      ctx.stroke();

      // White-hot plasma core
      if (layer === 0 || layer === 6) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    }

    // 3. Ejected High-Energy Particle Sparks & Magnetic Embers
    const sparks = sparksRef.current!;
    for (let i = 0; i < sparks.length; i++) {
      const sp = sparks[i];
      const curAngle = sp.angle + loopProgress * sp.speed;
      const radialDrift = sp.radialDist + Math.sin(loopProgress * 3 + sp.phase) * 35;
      const r = ringRadius + radialDrift;

      const sx = centerX + Math.cos(curAngle) * r;
      const sy = centerY + Math.sin(curAngle) * (r * 0.75);

      const flicker = Math.sin(frame * 0.2 + sp.phase) * 0.4 + 0.6;
      const sSize = sp.size * flicker;

      const sparkGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sSize * 2.5);
      sparkGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      sparkGrad.addColorStop(0.4, "rgba(254, 215, 170, 0.85)");
      sparkGrad.addColorStop(0.8, "rgba(249, 115, 22, 0.4)");
      sparkGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = sparkGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, sSize * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, particleCount]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#010105",
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
