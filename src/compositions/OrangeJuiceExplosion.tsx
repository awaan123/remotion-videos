import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface OrangeJuiceProps {
  dropletCount?: number;
}

interface JuiceDroplet {
  theta: number;
  phi: number;
  speed: number;
  baseRadius: number;
  wobbleSpeed: number;
  wobblePhase: number;
  isPulp: boolean;
  splatTime: number;
  splatSize: number;
}

interface JuiceTendril {
  angle: number;
  elevation: number;
  speed: number;
  seed: number;
}

export const OrangeJuiceExplosion: React.FC<OrangeJuiceProps> = ({
  dropletCount = 1300,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const simRef = useRef<{
    droplets: JuiceDroplet[];
    tendrils: JuiceTendril[];
  } | null>(null);

  if (!simRef.current) {
    const droplets: JuiceDroplet[] = [];
    for (let i = 0; i < dropletCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 1.8 - 0.9);
      droplets.push({
        theta,
        phi,
        speed: 0.8 + Math.random() * 2.2,
        baseRadius: (2.5 + Math.random() * 8.5) * (i % 10 === 0 ? 2.4 : 1.0),
        wobbleSpeed: 0.08 + Math.random() * 0.12,
        wobblePhase: Math.random() * Math.PI * 2,
        isPulp: i % 4 === 0, // 25% are tiny bright pulp vesicles
        splatTime: 0.15 + Math.random() * 0.65,
        splatSize: 50 + Math.random() * 90,
      });
    }

    const tendrils: JuiceTendril[] = [];
    for (let t = 0; t < 26; t++) {
      tendrils.push({
        angle: (t / 26) * Math.PI * 2 + (Math.random() - 0.5) * 0.2,
        elevation: (Math.random() * 0.6 - 0.2) * Math.PI,
        speed: 1.1 + Math.random() * 0.75,
        seed: t * 93.7,
      });
    }

    simRef.current = { droplets, tendrils };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Deep Studio Black with warm amber center backlight
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      10,
      width * 0.5,
      height * 0.5,
      width * 0.85
    );
    bgGrad.addColorStop(0, "#120803");
    bgGrad.addColorStop(0.4, "#060301");
    bgGrad.addColorStop(1, "#000000");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const t = frame / durationInFrames;
    const burstProgress = Math.pow(t, 0.58);
    const globalDist = burstProgress * Math.max(width, height) * 0.95;

    const { droplets, tendrils } = simRef.current!;

    // 1. Organic Citrus Liquid Splash Tendrils
    if (t < 0.85) {
      const tendrilLife = Math.max(0, 1 - Math.pow(t / 0.85, 1.4));
      ctx.save();

      for (let i = 0; i < tendrils.length; i++) {
        const tendril = tendrils[i];
        const dirX = Math.cos(tendril.angle) * Math.cos(tendril.elevation);
        const dirY = Math.sin(tendril.angle) * Math.cos(tendril.elevation);
        const dirZ = Math.sin(tendril.elevation);

        const currentLen = globalDist * 0.7 * tendril.speed;
        const zCam = 500 - dirZ * currentLen * 0.8;
        if (zCam <= 30) continue;
        const pers = 650 / zCam;

        ctx.beginPath();
        let prevX = centerX;
        let prevY = centerY;

        for (let s = 0; s <= 12; s++) {
          const sFrac = s / 12;
          const sDist = currentLen * sFrac;
          const wave = Math.sin(sFrac * Math.PI * 3 + frame * 0.1 + tendril.seed) * (15 * (1 - sFrac));

          const curX3d = dirX * sDist - dirY * wave;
          const curY3d = dirY * sDist + dirX * wave + sFrac * sFrac * 35;

          const curScreenX = centerX + curX3d * pers;
          const curScreenY = centerY + curY3d * pers;

          if (s === 0) ctx.moveTo(curScreenX, curScreenY);
          else {
            const midX = (prevX + curScreenX) * 0.5;
            const midY = (prevY + curScreenY) * 0.5;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
          }
          prevX = curScreenX;
          prevY = curScreenY;
        }

        const lineWidth = Math.max(1.5, (16 * (1 - t * 0.9) * tendrilLife) * pers);
        ctx.lineWidth = lineWidth;

        // Rich Citrus Orange Gradient Stroke
        const grad = ctx.createLinearGradient(centerX, centerY, prevX, prevY);
        const alpha = Math.min(0.9, tendrilLife * 1.3);
        grad.addColorStop(0, `rgba(254, 215, 170, ${alpha})`); // Pulp highlight
        grad.addColorStop(0.3, `rgba(249, 115, 22, ${alpha * 0.9})`); // Vibrant Orange
        grad.addColorStop(0.7, `rgba(234, 88, 12, ${alpha * 0.7})`); // Deep Amber
        grad.addColorStop(1, `rgba(254, 240, 138, ${alpha * 0.9})`); // Outer crown rim

        ctx.strokeStyle = grad;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.restore();
    }

    // 2. 1,300+ Aerodynamic Orange Juice Droplets & Lens Splatters
    const renderList = [];
    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];

      const dirX = Math.sin(d.phi) * Math.cos(d.theta);
      const dirY = Math.sin(d.phi) * Math.sin(d.theta);
      const dirZ = Math.cos(d.phi);

      const dist = globalDist * d.speed;
      const x3d = dirX * dist;
      const y3d = dirY * dist + t * t * 65;
      const z3d = 500 - dirZ * dist * 1.2;

      const isHit = z3d <= 35 && dirZ > 0.4;
      const scale = 650 / Math.max(30, z3d);
      const screenX = centerX + x3d * scale;
      const screenY = centerY + y3d * scale;
      const radius = d.baseRadius * scale;

      renderList.push({ d, dirX, dirY, screenX, screenY, radius, z3d, scale, isHit });
    }

    renderList.sort((a, b) => b.z3d - a.z3d);

    for (let i = 0; i < renderList.length; i++) {
      const item = renderList[i];
      const { d, dirX, dirY, screenX, screenY, radius, z3d, isHit } = item;

      if (screenX < -radius * 3 || screenX > width + radius * 3 || screenY < -radius * 3 || screenY > height + radius * 3) {
        continue;
      }

      ctx.save();
      ctx.translate(screenX, screenY);

      if (isHit) {
        // Wet Orange Juice Camera Lens Splatter
        const splatAge = Math.min(1.0, (t - d.splatTime) * 3.5);
        if (splatAge > 0) {
          const splatR = d.splatSize * (0.4 + splatAge * 0.6);
          const splatAlpha = Math.max(0, 0.78 * (1 - t * 0.35));

          const splatGrad = ctx.createRadialGradient(0, 0, splatR * 0.15, 0, 0, splatR);
          splatGrad.addColorStop(0, `rgba(254, 215, 170, ${splatAlpha * 0.9})`);
          splatGrad.addColorStop(0.35, `rgba(249, 115, 22, ${splatAlpha * 0.65})`);
          splatGrad.addColorStop(0.75, `rgba(234, 88, 12, ${splatAlpha * 0.3})`);
          splatGrad.addColorStop(0.92, `rgba(254, 240, 138, ${splatAlpha * 0.75})`);
          splatGrad.addColorStop(1, "rgba(249, 115, 22, 0)");

          ctx.fillStyle = splatGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, splatR, splatR * 0.82, d.theta, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Aerodynamically Deformed Flying Citrus Droplet
        const flightAngle = Math.atan2(dirY, dirX);
        ctx.rotate(flightAngle);

        const speedStretch = Math.min(2.3, 1.0 + (d.speed * 0.35) * (1 - t * 0.5));
        const wobble = Math.sin(frame * d.wobbleSpeed + d.wobblePhase) * 0.16;
        const radX = radius * (speedStretch + wobble);
        const radY = radius / (Math.sqrt(speedStretch) - wobble * 0.5);

        // Translucent Orange Liquid Body with Specular Highlight
        const dropGrad = ctx.createRadialGradient(
          -radX * 0.28,
          -radY * 0.3,
          radX * 0.08,
          0,
          0,
          radX
        );
        dropGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)"); // Specular glint
        dropGrad.addColorStop(0.18, "rgba(254, 240, 138, 0.9)"); // Warm gold halo
        dropGrad.addColorStop(0.55, d.isPulp ? "rgba(251, 146, 60, 0.85)" : "rgba(234, 88, 12, 0.35)"); // Body
        dropGrad.addColorStop(0.85, "rgba(249, 115, 22, 0.75)"); // Meniscus rim
        dropGrad.addColorStop(0.98, "rgba(254, 240, 138, 0.95)"); // Razor boundary
        dropGrad.addColorStop(1, "rgba(249, 115, 22, 0)");

        ctx.fillStyle = dropGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }, [frame, width, height, durationInFrames, dropletCount]);

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
