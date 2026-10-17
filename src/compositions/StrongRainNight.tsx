import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface RainProps {
  streakCount?: number;
}

interface RainStreak {
  x: number;
  y: number;
  z: number; // 0 (far) to 1 (near)
  speed: number;
  length: number;
  thickness: number;
  alpha: number;
}

interface SplashRipple {
  x: number;
  y: number;
  birthFrame: number;
  maxRadius: number;
}

interface LensDroplet {
  x: number;
  y: number;
  radius: number;
  slideSpeed: number;
}

export const StrongRainNight: React.FC<RainProps> = ({
  streakCount = 2200,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rainRef = useRef<{
    streaks: RainStreak[];
    splashes: SplashRipple[];
    lensDroplets: LensDroplet[];
  } | null>(null);

  if (!rainRef.current) {
    const streaks: RainStreak[] = [];
    for (let i = 0; i < streakCount; i++) {
      const z = 0.15 + Math.random() * 0.85;
      streaks.push({
        x: Math.random() * (width * 1.4) - width * 0.2,
        y: Math.random() * (height * 1.5),
        z,
        speed: (28 + Math.random() * 32) * (0.6 + z * 0.8),
        length: (40 + Math.random() * 90) * (0.5 + z * 0.9),
        thickness: (1.2 + Math.random() * 2.2) * z,
        alpha: (0.15 + Math.random() * 0.45) * z,
      });
    }

    // 60 Ground puddle splash ripples
    const splashes: SplashRipple[] = [];
    for (let s = 0; s < 70; s++) {
      splashes.push({
        x: Math.random() * width,
        y: height * 0.72 + Math.random() * (height * 0.28),
        birthFrame: Math.floor(Math.random() * 40),
        maxRadius: 15 + Math.random() * 30,
      });
    }

    // 25 Camera lens rain droplets
    const lensDroplets: LensDroplet[] = [];
    for (let d = 0; d < 28; d++) {
      lensDroplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 8 + Math.random() * 24,
        slideSpeed: 0.2 + Math.random() * 0.6,
      });
    }

    rainRef.current = { streaks, splashes, lensDroplets };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Cinematic Moody Night Atmosphere (Stormy dark blue-gray with subtle back street/city illumination)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "#03060c"); // Pitch stormy night sky
    bgGrad.addColorStop(0.5, "#060b16"); // Atmospheric navy haze
    bgGrad.addColorStop(0.85, "#0b1324"); // Wet street horizon reflection
    bgGrad.addColorStop(1, "#020409"); // Asphalt ground shadow
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle atmospheric ambient street lamp backlight
    ctx.globalCompositeOperation = "screen";
    const streetLight = ctx.createRadialGradient(
      width * 0.5,
      height * 0.65,
      10,
      width * 0.5,
      height * 0.65,
      width * 0.6
    );
    streetLight.addColorStop(0, "rgba(56, 189, 248, 0.12)"); // Cool cyan night ambiance
    streetLight.addColorStop(0.5, "rgba(30, 58, 138, 0.08)");
    streetLight.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = streetLight;
    ctx.fillRect(0, 0, width, height);

    const { streaks, splashes, lensDroplets } = rainRef.current!;

    // 2. Render 2,200+ Angled Wind Rain Streaks with Motion Blur
    const windAngle = 0.18; // ~10 degree diagonal wind slant
    const windSin = Math.sin(windAngle);
    const windCos = Math.cos(windAngle);

    const totalH = height * 1.5;
    const totalW = width * 1.4;

    for (let i = 0; i < streaks.length; i++) {
      const s = streaks[i];

      // Continuous falling trajectory with seamless wrap
      const fallDist = frame * s.speed;
      const curY = ((s.y + fallDist) % totalH) - height * 0.25;
      const curX = ((s.x + fallDist * windSin) % totalW) - width * 0.2;

      if (curY < -s.length || curY > height + s.length) continue;

      const tailX = curX - s.length * windSin;
      const tailY = curY - s.length * windCos;

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(curX, curY);

      // Rain streak luminance gradient (fading tail, bright droplet head)
      const streakGrad = ctx.createLinearGradient(tailX, tailY, curX, curY);
      streakGrad.addColorStop(0, "rgba(224, 242, 254, 0)");
      streakGrad.addColorStop(0.7, `rgba(224, 242, 254, ${s.alpha * 0.5})`);
      streakGrad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha * 1.2})`);

      ctx.strokeStyle = streakGrad;
      ctx.lineWidth = s.thickness;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // 3. Ground Puddle Splashes (Expanding Concentric Ellipses on Wet Asphalt)
    const splashCycle = 35; // Frames per ripple
    for (let p = 0; p < splashes.length; p++) {
      const sp = splashes[p];
      const age = (frame + sp.birthFrame) % splashCycle;
      const progress = age / splashCycle; // 0 to 1

      const curRadius = sp.maxRadius * progress;
      const alpha = Math.max(0, (1 - progress) * 0.45);

      ctx.beginPath();
      ctx.ellipse(sp.x, sp.y, curRadius * 1.8, curRadius * 0.45, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(224, 242, 254, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Micro crown splash crown droplet
      if (progress < 0.35) {
        const dropH = (1 - progress / 0.35) * 8;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.5})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y - dropH, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Camera Lens Rain Droplets (Wet Glass Refraction & Droplet Beading)
    for (let d = 0; d < lensDroplets.length; d++) {
      const ld = lensDroplets[d];
      const slideY = (ld.y + frame * ld.slideSpeed) % height;

      // Soft out-of-focus wet glass droplet
      const lensGrad = ctx.createRadialGradient(
        ld.x - ld.radius * 0.25,
        slideY - ld.radius * 0.25,
        ld.radius * 0.1,
        ld.x,
        slideY,
        ld.radius
      );
      lensGrad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
      lensGrad.addColorStop(0.4, "rgba(186, 230, 253, 0.15)");
      lensGrad.addColorStop(0.85, "rgba(224, 242, 254, 0.35)"); // Meniscus
      lensGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = lensGrad;
      ctx.beginPath();
      ctx.ellipse(ld.x, slideY, ld.radius, ld.radius * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, streakCount]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#03060c",
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
