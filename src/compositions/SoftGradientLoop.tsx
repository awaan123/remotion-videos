import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface SoftGradientProps {
  speed?: number;
}

export const defaultGradientProps: SoftGradientProps = {
  speed: 1,
};

export const SoftGradientLoop: React.FC<SoftGradientProps> = ({ speed = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use a lower internal resolution for ultra-smooth fluid blending, scaled up seamlessly
    const renderW = width;
    const renderH = height;

    // Seamless loop angle: 0 to 2*PI
    const progress = (frame % durationInFrames) / durationInFrames;
    const loopAngle = progress * Math.PI * 2 * speed;

    // 1. Base Layer: Vertical chromatic gradient covering full canvas edge-to-edge
    // Reference 444098349: Blue/Purple on top, Magenta in middle, Orange/Yellow at bottom
    const baseGrad = ctx.createLinearGradient(0, 0, 0, renderH);
    baseGrad.addColorStop(0.0, "#2b4cff"); // Electric Royal Blue
    baseGrad.addColorStop(0.25, "#8022ea"); // Radiant Deep Violet
    baseGrad.addColorStop(0.55, "#e6007e"); // Vivid Magenta / Hot Pink
    baseGrad.addColorStop(0.78, "#ff5100"); // Rich Sunset Orange
    baseGrad.addColorStop(1.0, "#ffb300"); // Warm Golden Yellow
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, renderW, renderH);

    // 2. Harmonic Fluid Blob Attractors that undulate organically
    // Each attractor has multiple sine/cosine harmonics for silky liquid movement
    const attractors = [
      // Top Cyan / Sky Blue cloud
      {
        baseX: renderW * 0.35,
        baseY: renderH * 0.18,
        radius: renderW * 0.48,
        color: "#00d4ff",
        dx: Math.sin(loopAngle) * (renderW * 0.12),
        dy: Math.cos(loopAngle) * (renderH * 0.08),
        opacity: 0.85,
      },
      // Top-Right Deep Violet / Indigo pool
      {
        baseX: renderW * 0.78,
        baseY: renderH * 0.22,
        radius: renderW * 0.52,
        color: "#6b11ff",
        dx: Math.cos(loopAngle) * (renderW * 0.14),
        dy: Math.sin(loopAngle) * (renderH * 0.09),
        opacity: 0.88,
      },
      // Center-Left Vivid Magenta / Pink wave
      {
        baseX: renderW * 0.22,
        baseY: renderH * 0.48,
        radius: renderW * 0.55,
        color: "#ff007f",
        dx: Math.sin(loopAngle + 1.2) * (renderW * 0.15),
        dy: Math.cos(loopAngle + 1.2) * (renderH * 0.12),
        opacity: 0.9,
      },
      // Center-Right Fuchsia / Purple swell
      {
        baseX: renderW * 0.72,
        baseY: renderH * 0.52,
        radius: renderW * 0.5,
        color: "#c200fb",
        dx: Math.cos(loopAngle + 2.0) * (renderW * 0.13),
        dy: Math.sin(loopAngle + 2.0) * (renderH * 0.11),
        opacity: 0.82,
      },
      // Mid-Low Vibrant Coral / Coral-Red wave crest
      {
        baseX: renderW * 0.48,
        baseY: renderH * 0.68,
        radius: renderW * 0.58,
        color: "#ff2a55",
        dx: Math.sin(loopAngle * 2) * (renderW * 0.08),
        dy: Math.cos(loopAngle) * (renderH * 0.09),
        opacity: 0.78,
      },
      // Bottom Golden Yellow warm bed
      {
        baseX: renderW * 0.55,
        baseY: renderH * 0.88,
        radius: renderW * 0.65,
        color: "#ffba08",
        dx: Math.cos(loopAngle) * (renderW * 0.12),
        dy: Math.sin(loopAngle) * (renderH * 0.06),
        opacity: 0.92,
      },
      // Bottom-Left Deep Amber glow
      {
        baseX: renderW * 0.15,
        baseY: renderH * 0.92,
        radius: renderW * 0.45,
        color: "#f77f00",
        dx: Math.sin(loopAngle + 3.1) * (renderW * 0.1),
        dy: Math.cos(loopAngle + 3.1) * (renderH * 0.05),
        opacity: 0.85,
      },
    ];

    // Render fluid blend with soft-light and screen composite modes for luminous color mixing
    for (const b of attractors) {
      const x = b.baseX + b.dx;
      const y = b.baseY + b.dy;

      const radGrad = ctx.createRadialGradient(x, y, 0, x, y, b.radius);
      radGrad.addColorStop(0.0, b.color);
      radGrad.addColorStop(0.45, b.color + "cc");
      radGrad.addColorStop(0.75, b.color + "44");
      radGrad.addColorStop(1.0, "transparent");

      ctx.save();
      ctx.globalAlpha = b.opacity;
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(x, y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Gentle Chromatic Wave Distortion Overlay (silky undulation)
    const waveY = Math.sin(loopAngle) * (renderH * 0.04);
    const waveGrad = ctx.createLinearGradient(0, renderH * 0.35 + waveY, 0, renderH * 0.7 + waveY);
    waveGrad.addColorStop(0.0, "transparent");
    waveGrad.addColorStop(0.5, "rgba(255, 0, 128, 0.28)");
    waveGrad.addColorStop(1.0, "transparent");

    ctx.save();
    ctx.fillStyle = waveGrad;
    ctx.fillRect(0, 0, renderW, renderH);
    ctx.restore();
  }, [frame, width, height, durationInFrames, speed]);

  return (
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
  );
};
