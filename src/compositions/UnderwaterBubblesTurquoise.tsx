import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface UnderwaterBubblesProps {
  bubbleCount?: number;
}

interface Bubble {
  x: number;
  y: number;
  z: number; // 0 (far) to 1 (close to camera)
  radius: number;
  baseSpeed: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobblePhase: number;
  specularOffset: number;
}

export const UnderwaterBubblesTurquoise: React.FC<UnderwaterBubblesProps> = ({
  bubbleCount = 350,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize deterministic bubbles
  const bubblesRef = useRef<Bubble[] | null>(null);
  if (!bubblesRef.current) {
    const bubbles: Bubble[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      const z = 0.1 + Math.random() * 0.9; // 0.1 = far, 1.0 = foreground bokeh
      const baseRadius = (8 + Math.random() * 28) * (z * 1.5);
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 1.5), // distributed vertically
        z,
        radius: baseRadius,
        baseSpeed: (1.2 + Math.random() * 2.2) * (0.8 + z * 0.8),
        wobbleSpeed: 0.04 + Math.random() * 0.05,
        wobbleAmp: 15 + Math.random() * 35 * z,
        wobblePhase: Math.random() * Math.PI * 2,
        specularOffset: 0.25 + Math.random() * 0.1,
      });
    }
    // Sort by z so background bubbles render first
    bubbles.sort((a, b) => a.z - b.z);
    bubblesRef.current = bubbles;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Crystal Clear Turquoise Deep Pool Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, "#22d3ee"); // Bright sunlit surface turquoise
    bgGrad.addColorStop(0.25, "#06b6d4"); // Crystal cyan
    bgGrad.addColorStop(0.65, "#0891b2"); // Deep turquoise pool
    bgGrad.addColorStop(1, "#083344"); // Deep aquatic bottom
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Volumetric Sun Rays / Caustic Light Beams from Surface
    ctx.globalCompositeOperation = "screen";
    const numRays = 8;
    for (let r = 0; r < numRays; r++) {
      const rayAngle = -0.15 + (r / numRays) * 0.3 + Math.sin(frame * 0.015 + r) * 0.02;
      const rayWidth = width * 0.12 + Math.sin(frame * 0.02 + r * 2) * 50;
      const rayStartX = width * (0.15 + (r / numRays) * 0.7);

      const rayGrad = ctx.createLinearGradient(rayStartX, 0, rayStartX + Math.tan(rayAngle) * height, height);
      const rayAlpha = 0.12 + Math.sin(frame * 0.025 + r * 1.5) * 0.05;
      rayGrad.addColorStop(0, `rgba(207, 250, 254, ${rayAlpha * 1.5})`);
      rayGrad.addColorStop(0.5, `rgba(103, 232, 249, ${rayAlpha * 0.8})`);
      rayGrad.addColorStop(1, "rgba(6, 182, 212, 0)");

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(rayStartX - rayWidth * 0.5, 0);
      ctx.lineTo(rayStartX + rayWidth * 0.5, 0);
      ctx.lineTo(rayStartX + Math.tan(rayAngle) * height + rayWidth * 1.8, height);
      ctx.lineTo(rayStartX + Math.tan(rayAngle) * height - rayWidth * 1.8, height);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Render 3D Refractive Spherical Bubbles with Realistic Wobble
    const totalHeight = height * 1.5;
    const bubbles = bubblesRef.current!;

    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];

      // Calculate rising position with seamless loop wrapping
      const cycleProgress = (frame * b.baseSpeed) % totalHeight;
      let currentY = (b.y - cycleProgress + totalHeight) % totalHeight;
      // Adjust to screen space
      currentY -= height * 0.25;

      if (currentY < -150 || currentY > height + 150) continue;

      // Realistic physical hydrodynamic wobble
      const wobbleTime = frame * b.wobbleSpeed + b.wobblePhase;
      const currentX = b.x + Math.sin(wobbleTime) * b.wobbleAmp;
      const aspectWobble = 1 + Math.sin(wobbleTime * 1.5) * 0.12; // Slight horizontal elongation

      const radX = b.radius * aspectWobble;
      const radY = b.radius / aspectWobble;

      ctx.save();
      ctx.translate(currentX, currentY);

      if (b.z > 0.85) {
        // Foreground Out-of-Focus Cinematic Bokeh Bubble
        const bokehGrad = ctx.createRadialGradient(0, 0, radX * 0.3, 0, 0, radX * 1.8);
        bokehGrad.addColorStop(0, "rgba(224, 242, 254, 0.05)");
        bokehGrad.addColorStop(0.7, "rgba(186, 230, 253, 0.25)");
        bokehGrad.addColorStop(0.9, "rgba(255, 255, 255, 0.45)");
        bokehGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = bokehGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, radX * 1.8, radY * 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Crisp In-Focus Refractive Bubble Body
        // A. Translucent Fresnel outer rim
        const rimGrad = ctx.createRadialGradient(0, 0, radX * 0.4, 0, 0, radX);
        rimGrad.addColorStop(0, "rgba(8, 145, 178, 0.02)");
        rimGrad.addColorStop(0.7, "rgba(34, 211, 238, 0.15)");
        rimGrad.addColorStop(0.9, "rgba(207, 250, 254, 0.65)");
        rimGrad.addColorStop(1, "rgba(255, 255, 255, 0.85)");

        ctx.fillStyle = rimGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
        ctx.fill();

        // B. Curved Glass Specular Highlight Glint (Top-Left Sunlight Reflection)
        const specX = -radX * 0.35;
        const specY = -radY * 0.35;
        const specRad = radX * 0.28;

        const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specRad);
        specGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        specGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.7)");
        specGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = specGrad;
        ctx.beginPath();
        ctx.ellipse(specX, specY, specRad, specRad * 0.7, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // C. Subtle Secondary Bottom-Right Caustic Bounce Highlight
        const bounceX = radX * 0.3;
        const bounceY = radY * 0.3;
        const bounceRad = radX * 0.22;

        const bounceGrad = ctx.createRadialGradient(bounceX, bounceY, 0, bounceX, bounceY, bounceRad);
        bounceGrad.addColorStop(0, "rgba(165, 243, 252, 0.5)");
        bounceGrad.addColorStop(1, "rgba(165, 243, 252, 0)");

        ctx.fillStyle = bounceGrad;
        ctx.beginPath();
        ctx.ellipse(bounceX, bounceY, bounceRad, bounceRad * 0.5, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [frame, width, height, durationInFrames]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#083344",
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
