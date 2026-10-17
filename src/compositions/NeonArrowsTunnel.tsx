import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface NeonArrowsProps {
  arrowCount?: number;
  primaryColor?: string; // Blue / Cyan
  secondaryColor?: string; // Purple / Magenta
}

export const defaultNeonArrowsProps: NeonArrowsProps = {
  arrowCount: 22,
  primaryColor: "#00f2fe",
  secondaryColor: "#c084fc",
};

export const NeonArrowsTunnel: React.FC<NeonArrowsProps> = ({
  arrowCount = defaultNeonArrowsProps.arrowCount,
  primaryColor = defaultNeonArrowsProps.primaryColor,
  secondaryColor = defaultNeonArrowsProps.secondaryColor,
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

    // Deep Dark Cyber Cyberpunk Atmosphere
    const bg = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      10,
      width * 0.5,
      height * 0.5,
      width * 0.75
    );
    bg.addColorStop(0, "#070414");
    bg.addColorStop(0.5, "#030109");
    bg.addColorStop(1, "#010004");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.46;
    const floorY = height * 0.65;

    // Continuous seamless flight through the tunnel
    const progress = (frame / durationInFrames); // 0 to 1

    ctx.globalCompositeOperation = "screen";

    // Horizon vanishing point core glow
    const centerGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 280);
    centerGlow.addColorStop(0, "rgba(255, 255, 255, 0.7)");
    centerGlow.addColorStop(0.3, "rgba(0, 242, 254, 0.4)");
    centerGlow.addColorStop(0.7, "rgba(192, 132, 252, 0.2)");
    centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);

    // Render 3D Flying Chevron Arrows
    for (let i = 0; i < arrowCount; i++) {
      // Depth from 0 (horizon) to 1 (passed camera)
      const rawZ = (i / arrowCount + progress) % 1.0;
      const z = Math.pow(rawZ, 2.5); // Perspective acceleration
      if (z < 0.015) continue;

      const scale = z * (width * 0.55);
      const alpha = Math.min(1.0, z * 2.5) * (1 - Math.pow(rawZ, 6)); // Fade at distance and near lens

      // Alternate Blue and Purple
      const isBlue = i % 2 === 0;
      const coreColor = isBlue ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 245, 255, 0.95)";
      const glowColor = isBlue ? "rgba(0, 242, 254, 0.85)" : "rgba(217, 70, 239, 0.85)";
      const outerHalo = isBlue ? "rgba(59, 130, 246, 0.4)" : "rgba(168, 85, 247, 0.4)";

      // Draw V-Shaped / Chevron Arrow
      // Vertex points of the chevron arrow pointing forward (down tunnel)
      const tipY = centerY - scale * 0.45;
      const wingY = centerY + scale * 0.35;
      const leftX = centerX - scale;
      const rightX = centerX + scale;

      ctx.save();

      // Multi-pass neon tube stroke
      // A. Wide outer bloom
      ctx.beginPath();
      ctx.moveTo(leftX, wingY);
      ctx.lineTo(centerX, tipY);
      ctx.lineTo(rightX, wingY);
      ctx.strokeStyle = outerHalo;
      ctx.lineWidth = Math.max(4, z * 42);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      // B. Vivid Neon Color Core
      ctx.beginPath();
      ctx.moveTo(leftX, wingY);
      ctx.lineTo(centerX, tipY);
      ctx.lineTo(rightX, wingY);
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = Math.max(2, z * 20);
      ctx.stroke();

      // C. Blinding White Tube Spine
      ctx.beginPath();
      ctx.moveTo(leftX, wingY);
      ctx.lineTo(centerX, tipY);
      ctx.lineTo(rightX, wingY);
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = Math.max(1, z * 8);
      ctx.stroke();

      // Floor Reflection of the Arrow
      if (wingY < floorY || tipY < floorY) {
        const refAlpha = alpha * 0.28 * z;
        const refTipY = floorY + (floorY - tipY) * 0.7;
        const refWingY = floorY + (floorY - wingY) * 0.7;

        if (refWingY < height || refTipY < height) {
          ctx.beginPath();
          ctx.moveTo(leftX, refWingY);
          ctx.lineTo(centerX, refTipY);
          ctx.lineTo(rightX, refWingY);
          ctx.strokeStyle = glowColor.replace(/[\d\.]+\)$/, `${refAlpha})`);
          ctx.lineWidth = Math.max(2, z * 28);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    // Glossy Metallic Floor Overlay
    ctx.globalCompositeOperation = "source-over";
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
    floorGrad.addColorStop(0, "rgba(6, 4, 15, 0.4)");
    floorGrad.addColorStop(0.3, "rgba(10, 6, 22, 0.25)");
    floorGrad.addColorStop(1, "rgba(2, 1, 5, 0.8)");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, width, height - floorY);

    // Glowing Neon Guideway Lines on the Floor
    ctx.globalCompositeOperation = "screen";
    const leftGuideX = centerX - width * 0.38;
    const rightGuideX = centerX + width * 0.38;

    const lineGrad = ctx.createLinearGradient(centerX, floorY, leftGuideX, height);
    lineGrad.addColorStop(0, "rgba(0, 242, 254, 0.1)");
    lineGrad.addColorStop(1, "rgba(0, 242, 254, 0.7)");

    ctx.beginPath();
    ctx.moveTo(centerX, floorY);
    ctx.lineTo(leftGuideX, height);
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 3;
    ctx.stroke();

    const lineGradRight = ctx.createLinearGradient(centerX, floorY, rightGuideX, height);
    lineGradRight.addColorStop(0, "rgba(217, 70, 239, 0.1)");
    lineGradRight.addColorStop(1, "rgba(217, 70, 239, 0.7)");

    ctx.beginPath();
    ctx.moveTo(centerX, floorY);
    ctx.lineTo(rightGuideX, height);
    ctx.strokeStyle = lineGradRight;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames, arrowCount, primaryColor, secondaryColor]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#010004",
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
