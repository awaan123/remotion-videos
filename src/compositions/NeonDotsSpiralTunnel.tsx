import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface NeonDotsSpiralTunnelProps {
  ringCount?: number;
  dotsPerRing?: number;
}

export const NeonDotsSpiralTunnel: React.FC<NeonDotsSpiralTunnelProps> = ({
  ringCount = 36,
  dotsPerRing = 48,
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

    // Deep dark cyber environment
    ctx.fillStyle = "#020408";
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.44; // Slightly elevated horizon
    const floorY = height * 0.52;

    const loopProgress = (frame / durationInFrames) * Math.PI * 2;
    const travelSpeed = frame / durationInFrames; // 0 to 1

    ctx.globalCompositeOperation = "screen";

    // 1. Draw 3D Luminous Dots Tunnel
    for (let r = 0; r < ringCount; r++) {
      // Depth from 0 (deep horizon) to 1 (near camera) with continuous forward flight
      const rawZ = (r / ringCount + travelSpeed) % 1.0;
      const z = Math.pow(rawZ, 2.4); // Non-linear perspective acceleration
      if (z < 0.01) continue;

      const ringRadius = z * (width * 0.65);
      const ringAlpha = Math.min(1.0, z * 2.2) * (1 - Math.pow(rawZ, 5)); // Fade in at distance, fade out near camera
      const spiralTwist = rawZ * 4.5 + loopProgress;

      for (let d = 0; d < dotsPerRing; d++) {
        const angle = (d / dotsPerRing) * Math.PI * 2 + spiralTwist;
        const x = centerX + Math.cos(angle) * ringRadius;
        const y = centerY + Math.sin(angle) * (ringRadius * 0.75); // Elliptical 3D perspective

        const dotSize = Math.max(2, z * 18);

        // Alternating neon pink / cyan / violet laser colors
        const colorRatio = (d / dotsPerRing + rawZ) % 1.0;
        let dotColor: string;
        let glowColor: string;

        if (colorRatio < 0.45) {
          // Neon Pink / Fuchsia
          dotColor = `rgba(255, 230, 245, ${ringAlpha})`;
          glowColor = `rgba(236, 72, 153, ${ringAlpha * 0.75})`;
        } else if (colorRatio < 0.85) {
          // Electric Cyan / Blue
          dotColor = `rgba(224, 242, 254, ${ringAlpha})`;
          glowColor = `rgba(6, 182, 212, ${ringAlpha * 0.75})`;
        } else {
          // Vivid Violet
          dotColor = `rgba(243, 232, 255, ${ringAlpha})`;
          glowColor = `rgba(168, 85, 247, ${ringAlpha * 0.75})`;
        }

        // Draw laser dot core
        const dotGrad = ctx.createRadialGradient(x, y, 0, x, y, dotSize * 2.2);
        dotGrad.addColorStop(0, dotColor);
        dotGrad.addColorStop(0.35, glowColor);
        dotGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = dotGrad;
        ctx.beginPath();
        ctx.arc(x, y, dotSize * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // 2. Realistic Reflective Scratched Metal Floor Reflection
        if (y < floorY) {
          const distToFloor = floorY - y;
          const refY = floorY + distToFloor * 0.82;
          const refAlpha = ringAlpha * 0.28 * Math.max(0, 1 - (distToFloor / (height * 0.5)));

          if (refAlpha > 0.02 && refY < height) {
            const refSizeX = dotSize * 3.5; // Stretched horizontally on brushed metal
            const refSizeY = dotSize * 1.2;

            const refGrad = ctx.createRadialGradient(x, refY, 0, x, refY, refSizeX);
            refGrad.addColorStop(0, `rgba(255, 255, 255, ${refAlpha * 0.8})`);
            refGrad.addColorStop(0.4, glowColor.replace(/[\d\.]+\)$/, `${refAlpha})`));
            refGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = refGrad;
            ctx.beginPath();
            ctx.ellipse(x, refY, refSizeX, refSizeY, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 3. Brushed Metal Floor Texture Overlay
    ctx.globalCompositeOperation = "source-over";
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
    floorGrad.addColorStop(0, "rgba(5, 8, 15, 0.45)");
    floorGrad.addColorStop(0.3, "rgba(10, 15, 25, 0.2)");
    floorGrad.addColorStop(1, "rgba(2, 4, 8, 0.7)");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, width, height - floorY);

    // Horizon glowing laser line
    ctx.globalCompositeOperation = "screen";
    const horizonGrad = ctx.createLinearGradient(0, 0, width, 0);
    horizonGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
    horizonGrad.addColorStop(0.3, "rgba(236, 72, 153, 0.4)");
    horizonGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.75)");
    horizonGrad.addColorStop(0.7, "rgba(6, 182, 212, 0.4)");
    horizonGrad.addColorStop(1, "rgba(236, 72, 153, 0)");

    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, floorY - 1, width, 2);

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, ringCount, dotsPerRing]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#020408",
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
