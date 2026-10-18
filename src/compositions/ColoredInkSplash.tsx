import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface InkSplashProps {
  splashCount?: number;
}

interface InkDroplet {
  angle: number;
  speed: number;
  baseRadius: number;
  hue: number;
  sat: number;
  light: number;
  wobbleSpeed: number;
  wobblePhase: number;
}

export const ColoredInkSplash: React.FC<InkSplashProps> = ({
  splashCount = 800,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dropletsRef = useRef<InkDroplet[] | null>(null);

  if (!dropletsRef.current) {
    const list: InkDroplet[] = [];
    const hues = [330, 195, 45, 275, 160, 15]; // Magenta, Cyan, Gold, Violet, Emerald, Crimson
    for (let i = 0; i < splashCount; i++) {
      const hue = hues[i % hues.length];
      list.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 2.4,
        baseRadius: (3 + Math.random() * 12) * (i % 8 === 0 ? 2.5 : 1.0),
        hue,
        sat: 95,
        light: 58,
        wobbleSpeed: 0.08 + Math.random() * 0.1,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    }
    dropletsRef.current = list;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Deep Isolated Black
    ctx.fillStyle = "#010103";
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const t = frame / durationInFrames;
    const burstDist = Math.pow(t, 0.55) * Math.max(width, height) * 0.85;

    ctx.globalCompositeOperation = "screen";

    const droplets = dropletsRef.current!;

    // 1. Central Fluid Crown Impact Splatter
    if (t < 0.6) {
      const crownProgress = t / 0.6;
      const crownRadius = (width * 0.18) * Math.sin(crownProgress * Math.PI * 0.5);
      const crownAlpha = Math.max(0, 1 - crownProgress);

      const crownGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, crownRadius);
      crownGrad.addColorStop(0, `rgba(255, 255, 255, ${crownAlpha * 0.8})`);
      crownGrad.addColorStop(0.4, `rgba(236, 72, 153, ${crownAlpha * 0.6})`);
      crownGrad.addColorStop(0.8, `rgba(6, 182, 212, ${crownAlpha * 0.3})`);
      crownGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = crownGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, crownRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Multi-Chromatic Flying Ink Droplets & Tendrils
    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];
      const dist = burstDist * d.speed;
      const x = centerX + Math.cos(d.angle) * dist;
      const y = centerY + Math.sin(d.angle) * (dist * 0.9) + t * t * 50; // gravity sag

      if (x < -100 || x > width + 100 || y < -100 || y > height + 100) continue;

      const wobble = Math.sin(frame * d.wobbleSpeed + d.wobblePhase) * 0.18;
      const rad = d.baseRadius * (1 + wobble);

      const grad = ctx.createRadialGradient(x - rad * 0.25, y - rad * 0.25, 0, x, y, rad * 1.8);
      const alpha = Math.max(0.2, 1 - t * 0.3);

      grad.addColorStop(0, `hsla(${d.hue}, 100%, 85%, ${alpha})`); // Glossy highlight
      grad.addColorStop(0.35, `hsla(${d.hue}, ${d.sat}%, ${d.light}%, ${alpha * 0.85})`);
      grad.addColorStop(0.75, `hsla(${d.hue}, ${d.sat - 10}%, ${d.light - 15}%, ${alpha * 0.4})`);
      grad.addColorStop(1, `hsla(${d.hue}, ${d.sat}%, 0%, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, rad * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Trailing micro-droplets
      if (i % 3 === 0 && dist > 80) {
        const trailX = centerX + Math.cos(d.angle) * (dist * 0.75);
        const trailY = centerY + Math.sin(d.angle) * (dist * 0.75 * 0.9);
        const trailRad = rad * 0.35;

        const trailGrad = ctx.createRadialGradient(trailX, trailY, 0, trailX, trailY, trailRad * 2);
        trailGrad.addColorStop(0, `hsla(${d.hue}, 100%, 75%, ${alpha * 0.6})`);
        trailGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.arc(trailX, trailY, trailRad * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, splashCount]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#010103",
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
