import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface RainbowInkProps {
  backgroundColor?: string;
  inkDensity?: number;
}

interface InkPlume {
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  baseRadius: number;
  hue: number;
  sat: number;
  light: number;
  phaseOffset: number;
  numTendrils: number;
}

export const RainbowInkInWater: React.FC<RainbowInkProps> = ({
  backgroundColor = "#000000",
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Deterministic seed for plumes
  const plumesRef = useRef<InkPlume[] | null>(null);
  if (!plumesRef.current) {
    const hues = [340, 210, 45, 160, 280, 25, 190, 310]; // Rainbow spectrum: Magenta, Blue, Gold, Emerald, Violet, Orange, Cyan, Fuchsia
    plumesRef.current = hues.map((hue, i) => {
      const angle = (i / hues.length) * Math.PI * 2 + 0.3;
      const speed = 1.2 + ((i * 3) % 5) * 0.4;
      return {
        originX: width * 0.5 + Math.cos(angle) * (width * 0.08),
        originY: height * 0.45 + Math.sin(angle) * (height * 0.08),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.6, // gentle downward fluid sinking
        baseRadius: width * (0.04 + ((i % 4) * 0.015)),
        hue,
        sat: 90,
        light: 55,
        phaseOffset: i * 1.3,
        numTendrils: 7 + (i % 4),
      };
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Deep water backdrop
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const progress = frame / durationInFrames; // 0 to 1
    const t = frame * 0.8;

    ctx.globalCompositeOperation = "screen";

    const plumes = plumesRef.current!;
    for (let p = 0; p < plumes.length; p++) {
      const plume = plumes[p];
      const plumeAge = progress * 1.2;

      // Center of expanding plume
      const px = plume.originX + plume.vx * t;
      const py = plume.originY + plume.vy * t;

      // Draw multi-layered swirling ink tendrils
      for (let k = 0; k < plume.numTendrils; k++) {
        const tendrilAngle = (k / plume.numTendrils) * Math.PI * 2 + plume.phaseOffset + Math.sin(t * 0.02 + k) * 0.8;
        const dist = (plume.baseRadius * 0.8 + plumeAge * width * 0.22) * (0.6 + 0.4 * Math.sin(k * 2.1 + t * 0.03));
        
        const tx = px + Math.cos(tendrilAngle) * dist;
        const ty = py + Math.sin(tendrilAngle) * dist;
        const rad = Math.max(10, plume.baseRadius * (1.2 + plumeAge * 2.5) * (0.5 + 0.5 * Math.sin(k + 1)));

        const grad = ctx.createRadialGradient(tx, ty, 0, tx, ty, rad);
        const alpha = Math.max(0, 0.45 * (1 - Math.min(1, progress * 0.3)));
        
        grad.addColorStop(0, `hsla(${plume.hue}, ${plume.sat}%, ${plume.light + 10}%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(${(plume.hue + 20) % 360}, ${plume.sat}%, ${plume.light}%, ${alpha * 0.6})`);
        grad.addColorStop(0.8, `hsla(${(plume.hue + 40) % 360}, ${plume.sat - 10}%, ${plume.light - 10}%, ${alpha * 0.2})`);
        grad.addColorStop(1, `hsla(${plume.hue}, ${plume.sat}%, 0%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(tx, ty, rad, 0, Math.PI * 2);
        ctx.fill();

        // Secondary micro-droplet diffusion
        const subDist = dist * 1.35;
        const subX = px + Math.cos(tendrilAngle + 0.4) * subDist;
        const subY = py + Math.sin(tendrilAngle + 0.4) * subDist;
        const subRad = rad * 0.35;

        const subGrad = ctx.createRadialGradient(subX, subY, 0, subX, subY, subRad);
        subGrad.addColorStop(0, `hsla(${plume.hue}, 95%, 65%, ${alpha * 0.5})`);
        subGrad.addColorStop(1, `hsla(${plume.hue}, 95%, 65%, 0)`);
        ctx.fillStyle = subGrad;
        ctx.beginPath();
        ctx.arc(subX, subY, subRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central dense core
      const coreGrad = ctx.createRadialGradient(px, py, 0, px, py, plume.baseRadius * (1 + plumeAge * 1.5));
      coreGrad.addColorStop(0, `hsla(${plume.hue}, 90%, 65%, 0.6)`);
      coreGrad.addColorStop(0.5, `hsla(${plume.hue}, 85%, 50%, 0.3)`);
      coreGrad.addColorStop(1, `hsla(${plume.hue}, 85%, 40%, 0)`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(px, py, plume.baseRadius * (1 + plumeAge * 1.5), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, backgroundColor]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
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
