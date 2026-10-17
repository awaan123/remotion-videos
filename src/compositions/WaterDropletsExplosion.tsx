import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface WaterDropletsProps {
  dropletCount?: number;
}

interface FluidDroplet {
  theta: number;
  phi: number;
  speed: number;
  baseRadius: number;
  aspectRatio: number;
  wobbleSpeed: number;
  wobblePhase: number;
  splatTime: number; // When it hits the lens
  splatSize: number;
  trailCount: number;
}

interface SplashTendril {
  angle: number;
  elevation: number;
  speed: number;
  length: number;
  curl: number;
  segments: number;
  seed: number;
}

export const WaterDropletsExplosion: React.FC<WaterDropletsProps> = ({
  dropletCount = 1400,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Initialize Deterministic 3D Fluid Simulation Elements
  const simRef = useRef<{
    droplets: FluidDroplet[];
    tendrils: SplashTendril[];
  } | null>(null);

  if (!simRef.current) {
    const droplets: FluidDroplet[] = [];
    for (let i = 0; i < dropletCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      // Spherical distribution biased forward towards camera (+Z)
      const phi = Math.acos(Math.random() * 1.8 - 0.9); // Full 3D sphere

      droplets.push({
        theta,
        phi,
        speed: 0.8 + Math.random() * 2.2,
        baseRadius: (2.5 + Math.random() * 8.5) * (i % 12 === 0 ? 2.5 : 1.0),
        aspectRatio: 1.2 + Math.random() * 0.8, // Aerodynamically stretched
        wobbleSpeed: 0.08 + Math.random() * 0.12,
        wobblePhase: Math.random() * Math.PI * 2,
        splatTime: 0.15 + Math.random() * 0.65,
        splatSize: 45 + Math.random() * 95,
        trailCount: 2 + (i % 4),
      });
    }

    // 24 Organic Fluid Splashing Tendrils (Crown splash arms)
    const tendrils: SplashTendril[] = [];
    for (let t = 0; t < 28; t++) {
      tendrils.push({
        angle: (t / 28) * Math.PI * 2 + (Math.random() - 0.5) * 0.2,
        elevation: (Math.random() * 0.6 - 0.2) * Math.PI,
        speed: 1.1 + Math.random() * 0.8,
        length: 220 + Math.random() * 320,
        curl: (Math.random() - 0.5) * 0.8,
        segments: 14,
        seed: t * 137.5,
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

    // Deep Studio Isolated Black with ultra-subtle optical backlight (eliminates 8-bit quantization banding)
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      10,
      width * 0.5,
      height * 0.5,
      width * 0.85
    );
    bgGrad.addColorStop(0, "#0b0f19"); // Deep studio softbox illumination
    bgGrad.addColorStop(0.35, "#04060a");
    bgGrad.addColorStop(0.75, "#010203");
    bgGrad.addColorStop(1, "#000000"); // Pure edge black
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Slow-motion fluid time curve: explosive release (t^0.55) decelerating into suspended high-speed drift
    const t = frame / durationInFrames; // 0 to 1
    const burstProgress = Math.pow(t, 0.58);
    const globalDist = burstProgress * Math.max(width, height) * 0.95;

    const { droplets, tendrils } = simRef.current!;

    // =========================================================================
    // PASS 1: Central Organic Liquid Splash Filaments & Tendrils (Fluid arms)
    // =========================================================================
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

        for (let s = 0; s <= tendril.segments; s++) {
          const sFrac = s / tendril.segments;
          const sDist = currentLen * sFrac;
          const wave = Math.sin(sFrac * Math.PI * 3 + frame * 0.1 + tendril.seed) * (15 * (1 - sFrac));

          const curX3d = dirX * sDist - dirY * wave;
          const curY3d = dirY * sDist + dirX * wave + sFrac * sFrac * 40; // slight gravity sag

          const curScreenX = centerX + curX3d * pers;
          const curScreenY = centerY + curY3d * pers;

          if (s === 0) {
            ctx.moveTo(curScreenX, curScreenY);
          } else {
            // Smooth curve
            const midX = (prevX + curScreenX) * 0.5;
            const midY = (prevY + curScreenY) * 0.5;
            ctx.quadraticCurveTo(prevX, prevY, midX, midY);
          }
          prevX = curScreenX;
          prevY = curScreenY;
        }

        const lineWidth = Math.max(1, (18 * (1 - t * 0.9) * tendrilLife) * pers);
        ctx.lineWidth = lineWidth;

        // Fluid glass refraction stroke
        const grad = ctx.createLinearGradient(centerX, centerY, prevX, prevY);
        const alpha = Math.min(0.85, tendrilLife * 1.2);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
        grad.addColorStop(0.3, `rgba(224, 242, 254, ${alpha * 0.75})`);
        grad.addColorStop(0.7, `rgba(125, 211, 252, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.85})`);

        ctx.strokeStyle = grad;
        ctx.lineCap = "round";
        ctx.stroke();

        // Droplet pinch-off at tendril tips
        const tipRadius = lineWidth * 1.4;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(prevX, prevY, tipRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // =========================================================================
    // PASS 2: 1,400+ Aerodynamically Stretched Droplets & Wet Lens Splatters
    // =========================================================================
    // Calculate 3D perspective projection and sort
    const renderList = [];
    for (let i = 0; i < droplets.length; i++) {
      const d = droplets[i];

      const dirX = Math.sin(d.phi) * Math.cos(d.theta);
      const dirY = Math.sin(d.phi) * Math.sin(d.theta);
      const dirZ = Math.cos(d.phi);

      const dist = globalDist * d.speed;
      const x3d = dirX * dist;
      const y3d = dirY * dist + t * t * 70; // natural fluid gravity fall
      const z3d = 500 - dirZ * dist * 1.2;

      // Check for camera lens impact
      const isHit = z3d <= 35 && dirZ > 0.4;

      const scale = 650 / Math.max(30, z3d);
      const screenX = centerX + x3d * scale;
      const screenY = centerY + y3d * scale;
      const radius = d.baseRadius * scale;

      renderList.push({
        d,
        dirX,
        dirY,
        screenX,
        screenY,
        radius,
        z3d,
        scale,
        isHit,
      });
    }

    // Sort by depth (back to front)
    renderList.sort((a, b) => b.z3d - a.z3d);

    for (let i = 0; i < renderList.length; i++) {
      const item = renderList[i];
      const { d, dirX, dirY, screenX, screenY, radius, z3d, isHit } = item;

      if (
        screenX < -radius * 3 ||
        screenX > width + radius * 3 ||
        screenY < -radius * 3 ||
        screenY > height + radius * 3
      ) {
        continue;
      }

      ctx.save();
      ctx.translate(screenX, screenY);

      if (isHit) {
        // =====================================================================
        // CAMERA LENS WATER SPLAT (Photorealistic Flattened Liquid Impact)
        // =====================================================================
        const splatAge = Math.min(1.0, (t - d.splatTime) * 3.5);
        if (splatAge > 0) {
          const splatR = d.splatSize * (0.4 + splatAge * 0.6);
          const splatAlpha = Math.max(0, 0.75 * (1 - t * 0.4));

          // A. Soft Defocused Lens Water Bleed
          const splatGrad = ctx.createRadialGradient(0, 0, splatR * 0.2, 0, 0, splatR);
          splatGrad.addColorStop(0, `rgba(255, 255, 255, ${splatAlpha * 0.85})`);
          splatGrad.addColorStop(0.35, `rgba(224, 242, 254, ${splatAlpha * 0.5})`);
          splatGrad.addColorStop(0.75, `rgba(186, 230, 253, ${splatAlpha * 0.25})`);
          splatGrad.addColorStop(0.92, `rgba(255, 255, 255, ${splatAlpha * 0.7})`); // Meniscus ring
          splatGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.fillStyle = splatGrad;
          ctx.beginPath();
          // Organic non-circular splatter contour
          ctx.ellipse(0, 0, splatR, splatR * 0.85, d.theta, 0, Math.PI * 2);
          ctx.fill();

          // B. Fine droplet satellite splatters around impact
          for (let s = 0; s < 6; s++) {
            const sAngle = (s / 6) * Math.PI * 2 + d.wobblePhase;
            const sDist = splatR * (1.1 + 0.3 * Math.sin(s * 1.5));
            const sR = splatR * 0.12;
            const sx = Math.cos(sAngle) * sDist;
            const sy = Math.sin(sAngle) * sDist;

            ctx.fillStyle = `rgba(255, 255, 255, ${splatAlpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(sx, sy, sR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        // =====================================================================
        // 3D IN-FLIGHT WATER DROPLET (Aerodynamic Teardrop & Fluid Refraction)
        // =====================================================================
        // Flight direction angle
        const flightAngle = Math.atan2(dirY, dirX);
        ctx.rotate(flightAngle);

        // Aerodynamic elongation proportional to velocity
        const speedStretch = Math.min(2.4, 1.0 + (d.speed * 0.35) * (1 - t * 0.5));
        const wobble = Math.sin(frame * d.wobbleSpeed + d.wobblePhase) * 0.18;
        const radX = radius * (speedStretch + wobble);
        const radY = radius / (Math.sqrt(speedStretch) - wobble * 0.5);

        // A. Multi-Pass Liquid Caustic Refraction Body
        const dropGrad = ctx.createRadialGradient(
          -radX * 0.28,
          -radY * 0.3,
          radX * 0.08,
          0,
          0,
          radX
        );
        dropGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)"); // Blinding key-light specular glint
        dropGrad.addColorStop(0.18, "rgba(238, 246, 255, 0.82)"); // Keylight halo
        dropGrad.addColorStop(0.5, "rgba(30, 64, 110, 0.18)"); // Deep water internal body refraction
        dropGrad.addColorStop(0.82, "rgba(186, 230, 253, 0.65)"); // Caustic meniscus reflection
        dropGrad.addColorStop(0.96, "rgba(255, 255, 255, 0.92)"); // Razor-sharp Fresnel boundary
        dropGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = dropGrad;
        ctx.beginPath();
        // Teardrop aerodynamic profile
        ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
        ctx.fill();

        // B. Curved Key-Light Studio Softbox Glint
        if (radius > 5) {
          const glintX = -radX * 0.3;
          const glintY = -radY * 0.32;
          const glintW = radX * 0.35;
          const glintH = radY * 0.18;

          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.beginPath();
          ctx.ellipse(glintX, glintY, glintW, glintH, -Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // C. Secondary Caustic Rim Bounce (Simulating aquatic internal reflection)
        if (radius > 8) {
          const bounceX = radX * 0.32;
          const bounceY = radY * 0.3;
          const bounceW = radX * 0.28;
          const bounceH = radY * 0.14;

          ctx.fillStyle = "rgba(186, 230, 253, 0.6)";
          ctx.beginPath();
          ctx.ellipse(bounceX, bounceY, bounceW, bounceH, -Math.PI / 6, 0, Math.PI * 2);
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
