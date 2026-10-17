import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface SilkRibbonProps {
  ribbonCount?: number;
}

export const SilkRibbonWaves: React.FC<SilkRibbonProps> = ({
  ribbonCount = 14,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Deep luxury dark blue-indigo backdrop
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#030712");
    bg.addColorStop(0.5, "#0b0f19");
    bg.addColorStop(1, "#020617");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const loopProgress = (frame / durationInFrames) * Math.PI * 2;

    ctx.globalCompositeOperation = "screen";

    // Draw multi-layered undulating 3D iridescent silk ribbons
    for (let r = 0; r < ribbonCount; r++) {
      const depth = r / ribbonCount; // 0 (back) to 1 (front)
      const yOffset = height * (0.3 + depth * 0.4);
      const amp = (height * 0.12) * (0.7 + depth * 0.6);
      const freq = 0.0015 + depth * 0.0005;
      const phase = loopProgress + r * 0.45;

      ctx.beginPath();
      // Step across width
      const step = 20;
      let firstX = 0;
      let firstY = 0;

      for (let x = 0; x <= width + step; x += step) {
        // Multi-harmonic sine calculation
        const harmonic1 = Math.sin(x * freq + phase) * amp;
        const harmonic2 = Math.cos(x * freq * 1.8 - phase * 0.8) * (amp * 0.4);
        const y = yOffset + harmonic1 + harmonic2;

        if (x === 0) {
          firstX = x;
          firstY = y;
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Complete ribbon thickness
      const thickness = 60 + depth * 90;
      for (let x = width + step; x >= -step; x -= step) {
        const harmonic1 = Math.sin(x * freq + phase + 0.25) * amp;
        const harmonic2 = Math.cos(x * freq * 1.8 - phase * 0.8 + 0.25) * (amp * 0.4);
        const y = yOffset + harmonic1 + harmonic2 + thickness;
        ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Iridescent silk gradient across ribbon
      const grad = ctx.createLinearGradient(0, yOffset - amp, width, yOffset + amp + thickness);
      const alpha = 0.25 + depth * 0.45;

      // Color shifting across depth
      if (r % 3 === 0) {
        grad.addColorStop(0, `rgba(59, 130, 246, ${alpha})`); // Royal Blue
        grad.addColorStop(0.5, `rgba(168, 85, 247, ${alpha * 0.8})`); // Violet
        grad.addColorStop(1, `rgba(236, 72, 153, ${alpha * 0.4})`); // Magenta
      } else if (r % 3 === 1) {
        grad.addColorStop(0, `rgba(14, 165, 233, ${alpha})`); // Cyan
        grad.addColorStop(0.5, `rgba(99, 102, 241, ${alpha * 0.8})`); // Indigo
        grad.addColorStop(1, `rgba(217, 70, 239, ${alpha * 0.4})`); // Fuchsia
      } else {
        grad.addColorStop(0, `rgba(244, 63, 94, ${alpha * 0.7})`); // Rose
        grad.addColorStop(0.5, `rgba(139, 92, 246, ${alpha * 0.9})`); // Purple
        grad.addColorStop(1, `rgba(6, 182, 212, ${alpha * 0.5})`); // Sky
      }

      ctx.fillStyle = grad;
      ctx.fill();

      // Specular Silk Crest Highlight (Fine light sheen along the ribbon spine)
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        const harmonic1 = Math.sin(x * freq + phase) * amp;
        const harmonic2 = Math.cos(x * freq * 1.8 - phase * 0.8) * (amp * 0.4);
        const y = yOffset + harmonic1 + harmonic2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 2 + depth * 3;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + depth * 0.4})`;
      ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, ribbonCount]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#030712",
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
