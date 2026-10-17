import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface WaterDropletsProps {
  dropletCount?: number;
}

interface WaterParticle {
  theta: number; // Horizontal angle
  phi: number; // Vertical angle
  speed: number;
  baseSize: number;
  phase: number;
  wobbleFreq: number;
  isLensSplash: boolean;
}

export const WaterDropletsExplosion: React.FC<WaterDropletsProps> = ({
  dropletCount = 1100,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const particlesRef = useRef<WaterParticle[] | null>(null);
  if (!particlesRef.current) {
    const list: WaterParticle[] = [];
    for (let i = 0; i < dropletCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      // Bias slightly towards the camera (phi concentrated around z > 0)
      const phi = (Math.random() * 0.75 + 0.1) * Math.PI;
      list.push({
        theta,
        phi,
        speed: 0.6 + Math.random() * 1.8,
        baseSize: (2.5 + Math.random() * 9.5) * (i % 8 === 0 ? 2.2 : 1.0), // occasional macro hero droplets
        phase: Math.random() * Math.PI * 2,
        wobbleFreq: 0.08 + Math.random() * 0.1,
        isLensSplash: i % 25 === 0, // Droplets that burst right in front of camera
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

    // 1. Studio Lighting Atmosphere (Subtle deep oceanic-charcoal center spotlight to prevent color banding)
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      50,
      width * 0.5,
      height * 0.5,
      width * 0.75
    );
    bgGrad.addColorStop(0, "#080c14"); // Subtle deep studio illumination
    bgGrad.addColorStop(0.5, "#030408"); // Near-black transition
    bgGrad.addColorStop(1, "#000000"); // Pure isolated black
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Slow-motion burst physics curve: Rapid initial explosion expanding into suspended slow-mo float
    const progress = frame / durationInFrames; // 0 to 1
    const slowMoDist = Math.pow(progress, 0.62) * Math.max(width, height) * 0.95;

    const particles = particlesRef.current!;

    // Sort active particles by depth for correct 3D occlusion
    const renderList = [];
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // 3D Direction Vector
      const dirX = Math.sin(p.phi) * Math.cos(p.theta);
      const dirY = Math.sin(p.phi) * Math.sin(p.theta);
      const dirZ = Math.cos(p.phi); // Z-axis towards camera

      // Distance traveled along velocity vector with individual speed
      const dist = slowMoDist * p.speed;
      const x3d = dirX * dist;
      const y3d = dirY * dist + progress * 60; // slight downward gravity drip
      const z3d = 500 - dirZ * dist * 1.1; // Camera starts at z=500

      if (z3d <= 15) continue; // Passed behind lens

      const scale = 650 / z3d;
      const screenX = centerX + x3d * scale;
      const screenY = centerY + y3d * scale;
      const radius = p.baseSize * scale;

      renderList.push({
        p,
        screenX,
        screenY,
        radius,
        z3d,
        scale,
      });
    }

    // Render back to front
    renderList.sort((a, b) => b.z3d - a.z3d);

    for (let i = 0; i < renderList.length; i++) {
      const item = renderList[i];
      const { p, screenX, screenY, radius, z3d } = item;

      if (
        screenX < -radius * 2 ||
        screenX > width + radius * 2 ||
        screenY < -radius * 2 ||
        screenY > height + radius * 2
      ) {
        continue;
      }

      ctx.save();
      ctx.translate(screenX, screenY);

      if (z3d < 90 && p.isLensSplash) {
        // Foreground Out-of-Focus Water Splash on Camera Lens (Soft Optical Bokeh)
        const bRad = radius * 2.2;
        const bokehGrad = ctx.createRadialGradient(0, 0, bRad * 0.2, 0, 0, bRad);
        bokehGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
        bokehGrad.addColorStop(0.6, "rgba(186, 230, 253, 0.22)");
        bokehGrad.addColorStop(0.9, "rgba(224, 242, 254, 0.45)");
        bokehGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = bokehGrad;
        ctx.beginPath();
        ctx.arc(0, 0, bRad, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Crisp 3D Refractive Water Droplet with Fluid Surface Tension Wobble
        const wobble = Math.sin(frame * p.wobbleFreq + p.phase) * 0.15;
        const radX = radius * (1 + wobble);
        const radY = radius / (1 + wobble);

        // A. Translucent Spherical Body with Caustic Refraction Rim
        const bodyGrad = ctx.createRadialGradient(
          -radX * 0.3,
          -radY * 0.35,
          radX * 0.05,
          0,
          0,
          radX
        );
        bodyGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)"); // Specular glint core
        bodyGrad.addColorStop(0.2, "rgba(224, 242, 254, 0.75)"); // Refraction light
        bodyGrad.addColorStop(0.55, "rgba(56, 189, 248, 0.15)"); // Translucent water body
        bodyGrad.addColorStop(0.85, "rgba(186, 230, 253, 0.65)"); // Caustic meniscus rim
        bodyGrad.addColorStop(1, "rgba(255, 255, 255, 0.9)"); // Sharp outer boundary

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, radX, radY, p.phase, 0, Math.PI * 2);
        ctx.fill();

        // B. Curved Key-Light Specular Glint (Simulating Studio Softbox Reflection)
        if (radius > 4) {
          const glintX = -radX * 0.32;
          const glintY = -radY * 0.35;
          const glintW = radX * 0.32;
          const glintH = radY * 0.16;

          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.beginPath();
          ctx.ellipse(glintX, glintY, glintW, glintH, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // C. Bottom Ambient Bounce Highlight (Meniscus Light Capture)
        if (radius > 7) {
          const bounceX = radX * 0.28;
          const bounceY = radY * 0.32;
          const bounceW = radX * 0.25;
          const bounceH = radY * 0.12;

          ctx.fillStyle = "rgba(186, 230, 253, 0.55)";
          ctx.beginPath();
          ctx.ellipse(bounceX, bounceY, bounceW, bounceH, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }
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
