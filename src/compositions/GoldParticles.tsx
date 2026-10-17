import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface GoldParticlesProps {
  particleCount?: number;
  bokehCount?: number;
}

interface StarParticle {
  x: number;
  y: number;
  z: number; // 0 (far) to 1 (near)
  baseSize: number;
  driftSpeedY: number;
  swayFreq: number;
  swayAmp: number;
  phase: number;
  sparkleFreq: number;
  isStar: boolean;
}

export const GoldParticles: React.FC<GoldParticlesProps> = ({
  particleCount = 650,
  bokehCount = 70,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const particlesRef = useRef<StarParticle[] | null>(null);
  if (!particlesRef.current) {
    const list: StarParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const z = 0.1 + Math.random() * 0.9;
      list.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        baseSize: (2.5 + Math.random() * 5.5) * (0.6 + z * 0.9),
        driftSpeedY: (0.4 + Math.random() * 0.9) * (0.6 + z * 0.8),
        swayFreq: 0.02 + Math.random() * 0.03,
        swayAmp: 10 + Math.random() * 30 * z,
        phase: Math.random() * Math.PI * 2,
        sparkleFreq: 0.05 + Math.random() * 0.08,
        isStar: i % 5 === 0, // 20% are dazzling 4-point star glints
      });
    }
    list.sort((a, b) => a.z - b.z);
    particlesRef.current = list;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Luxury Dark Ebony & Warm Bronze Volumetric Backdrop
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.72,
      50,
      width * 0.5,
      height * 0.65,
      width * 0.85
    );
    bgGrad.addColorStop(0, "#1c1305"); // Deep warm gold core
    bgGrad.addColorStop(0.4, "#0e0903"); // Rich ebony bronze
    bgGrad.addColorStop(0.85, "#040301"); // Near black
    bgGrad.addColorStop(1, "#010100"); // Void black
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const floorY = height * 0.74; // Floor horizon

    // 2. Ambient Volumetric Golden Light Cone / Haze
    ctx.globalCompositeOperation = "screen";
    const coneGrad = ctx.createLinearGradient(0, height, 0, height * 0.2);
    coneGrad.addColorStop(0, "rgba(245, 158, 11, 0.35)");
    coneGrad.addColorStop(0.4, "rgba(217, 119, 6, 0.18)");
    coneGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coneGrad;
    ctx.fillRect(0, height * 0.2, width, height * 0.8);

    // 3. Large Defocused Bokeh Orbs (Background depth layer)
    for (let b = 0; b < bokehCount; b++) {
      const bProgress = (frame / durationInFrames) * Math.PI * 2;
      const bx = (Math.sin(b * 137.5) * 0.5 + 0.5) * width;
      const rawBy = (Math.cos(b * 269.3) * 0.5 + 0.5) * height;
      const bRadius = 35 + (Math.sin(b * 47) * 0.5 + 0.5) * 65;

      // Gentle vertical float with wrap
      const by = (rawBy - (frame * 0.5 + b * 15) % height + height) % height;
      const bAlpha = (Math.sin(bProgress * 2 + b) * 0.5 + 0.5) * 0.18 + 0.05;

      const bokehGrad = ctx.createRadialGradient(bx, by, bRadius * 0.1, bx, by, bRadius);
      bokehGrad.addColorStop(0, `rgba(254, 243, 199, ${bAlpha * 1.5})`);
      bokehGrad.addColorStop(0.4, `rgba(245, 158, 11, ${bAlpha})`);
      bokehGrad.addColorStop(0.85, `rgba(180, 83, 9, ${bAlpha * 0.4})`);
      bokehGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = bokehGrad;
      ctx.beginPath();
      ctx.arc(bx, by, bRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Render 650+ Multi-Layered Golden Particles with Ground Reflections & Starbursts
    const particles = particlesRef.current!;
    const loopTime = (frame / durationInFrames) * Math.PI * 2;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Seamless floating drift upwards
      const totalH = height * 1.2;
      const driftY = (p.y - ((frame * p.driftSpeedY * 2.2) % totalH) + totalH) % totalH - height * 0.1;
      const sway = Math.sin(frame * p.swayFreq + p.phase) * p.swayAmp;
      const px = p.x + sway;

      if (px < -50 || px > width + 50 || driftY < -50 || driftY > height + 50) continue;

      // Realistic sparkle flicker
      const sparkle = Math.sin(frame * p.sparkleFreq + p.phase * 3);
      const intensity = Math.max(0.2, (sparkle * 0.5 + 0.5) * 0.8 + 0.2);
      const pSize = p.baseSize * (0.8 + intensity * 0.4);

      // Colors: Pure 24K Gold, Champagne Gold & Diamond Highlights
      const isHero = p.z > 0.75;
      const coreColor = isHero ? "rgba(255, 255, 255, 0.98)" : "rgba(254, 243, 199, 0.95)";
      const goldColor = `rgba(245, 158, 11, ${intensity * p.z})`;
      const outerGlow = `rgba(217, 119, 6, ${intensity * p.z * 0.5})`;

      // Draw particle glow core
      const pGrad = ctx.createRadialGradient(px, driftY, 0, px, driftY, pSize * 3);
      pGrad.addColorStop(0, coreColor);
      pGrad.addColorStop(0.35, goldColor);
      pGrad.addColorStop(0.7, outerGlow);
      pGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(px, driftY, pSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Dazzling 4-Point Anamorphic Star Glint for hero particles
      if (p.isStar && intensity > 0.6) {
        const starLen = pSize * (3 + intensity * 5);
        const starAngle = loopTime * 0.5 + p.phase;

        ctx.save();
        ctx.translate(px, driftY);
        ctx.rotate(starAngle);

        const starGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, starLen);
        starGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        starGrad.addColorStop(0.3, "rgba(254, 240, 138, 0.7)");
        starGrad.addColorStop(1, "rgba(245, 158, 11, 0)");

        ctx.fillStyle = starGrad;
        // Horizontal beam
        ctx.beginPath();
        ctx.ellipse(0, 0, starLen, pSize * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        // Vertical beam
        ctx.beginPath();
        ctx.ellipse(0, 0, pSize * 0.35, starLen, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 5. Realistic Ground Floor Reflection
      if (driftY < floorY) {
        const distToFloor = floorY - driftY;
        const refY = floorY + distToFloor * 0.75;
        const refAlpha = p.z * 0.25 * Math.max(0, 1 - distToFloor / (height * 0.6));

        if (refAlpha > 0.02 && refY < height) {
          const refW = pSize * 4;
          const refH = pSize * 1.2;

          const refGrad = ctx.createRadialGradient(px, refY, 0, px, refY, refW);
          refGrad.addColorStop(0, `rgba(254, 240, 138, ${refAlpha * 0.9})`);
          refGrad.addColorStop(0.5, `rgba(245, 158, 11, ${refAlpha * 0.5})`);
          refGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = refGrad;
          ctx.beginPath();
          ctx.ellipse(px, refY, refW, refH, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 6. Luxury Metallic Floor Horizon Sheen
    ctx.globalCompositeOperation = "source-over";
    const floorOverlay = ctx.createLinearGradient(0, floorY, 0, height);
    floorOverlay.addColorStop(0, "rgba(18, 12, 3, 0.45)");
    floorOverlay.addColorStop(0.4, "rgba(10, 6, 2, 0.3)");
    floorOverlay.addColorStop(1, "rgba(3, 2, 1, 0.75)");
    ctx.fillStyle = floorOverlay;
    ctx.fillRect(0, floorY, width, height - floorY);

    // Glowing Golden Horizon Line
    ctx.globalCompositeOperation = "screen";
    const horizonGrad = ctx.createLinearGradient(0, 0, width, 0);
    horizonGrad.addColorStop(0, "rgba(217, 119, 6, 0)");
    horizonGrad.addColorStop(0.3, "rgba(245, 158, 11, 0.3)");
    horizonGrad.addColorStop(0.5, "rgba(254, 243, 199, 0.65)");
    horizonGrad.addColorStop(0.7, "rgba(245, 158, 11, 0.3)");
    horizonGrad.addColorStop(1, "rgba(217, 119, 6, 0)");
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, floorY - 1, width, 3);

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, particleCount, bokehCount]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#010100",
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
