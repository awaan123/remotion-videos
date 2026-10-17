import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface LowPolyProps {
  cols: number;
  rows: number;
  primaryColor: string; // Neon Cyan
  secondaryColor: string; // Neon Purple
  waveSpeed: number;
}

export const defaultLowPolyProps: LowPolyProps = {
  cols: 28,
  rows: 18,
  primaryColor: "#00f2fe",
  secondaryColor: "#7928ca",
  waveSpeed: 1,
};

export const NeonLowPolyMesh: React.FC<LowPolyProps> = ({
  cols = defaultLowPolyProps.cols,
  rows = defaultLowPolyProps.rows,
  primaryColor = defaultLowPolyProps.primaryColor,
  secondaryColor = defaultLowPolyProps.secondaryColor,
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

    // Deep Tech Cosmic Dark Background
    const bg = ctx.createRadialGradient(
      width / 2,
      height * 0.45,
      50,
      width / 2,
      height / 2,
      width * 0.75
    );
    bg.addColorStop(0, "#080c1d");
    bg.addColorStop(0.6, "#03050c");
    bg.addColorStop(1, "#010206");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const phase = (frame / durationInFrames) * Math.PI * 2;
    const cellW = (width * 1.3) / cols;
    const cellH = (height * 1.3) / rows;
    const startX = -width * 0.15;
    const startY = -height * 0.15;

    // Calculate vertex 3D positions with harmonic undulating waves
    const vertices: { x: number; y: number; z: number }[][] = [];

    for (let r = 0; r <= rows; r++) {
      vertices[r] = [];
      for (let c = 0; c <= cols; c++) {
        const baseX = startX + c * cellW;
        const baseY = startY + r * cellH;

        // Wave elevation formula
        const dist = Math.sqrt(
          Math.pow((c - cols / 2) / cols, 2) + Math.pow((r - rows / 2) / rows, 2)
        );
        const wave = Math.sin(dist * 6 - phase) * 45 + Math.cos(c * 0.4 + phase) * 25;

        // Perspective projection tilt
        const projY = baseY + wave * 0.7;
        vertices[r][c] = { x: baseX, y: projY, z: wave };
      }
    }

    // Render Triangular Facets with Neon Wireframe & Subtle Fills
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p1 = vertices[r][c];
        const p2 = vertices[r][c + 1];
        const p3 = vertices[r + 1][c];
        const p4 = vertices[r + 1][c + 1];

        // Triangle 1 (p1, p2, p3)
        const avgZ1 = (p1.z + p2.z + p3.z) / 3;
        const alpha1 = (avgZ1 + 70) / 140;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        ctx.fillStyle = primaryColor + Math.floor(Math.max(5, alpha1 * 25)).toString(16).padStart(2, "0");
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = primaryColor + Math.floor(Math.max(30, alpha1 * 180)).toString(16).padStart(2, "0");
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 6 * alpha1;
        ctx.stroke();

        // Triangle 2 (p2, p4, p3)
        const avgZ2 = (p2.z + p4.z + p3.z) / 3;
        const alpha2 = (avgZ2 + 70) / 140;

        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        ctx.fillStyle = secondaryColor + Math.floor(Math.max(5, alpha2 * 25)).toString(16).padStart(2, "0");
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = secondaryColor + Math.floor(Math.max(30, alpha2 * 180)).toString(16).padStart(2, "0");
        ctx.shadowColor = secondaryColor;
        ctx.shadowBlur = 6 * alpha2;
        ctx.stroke();

        // Glowing Communication Nodes at intersections
        if ((r + c) % 3 === 0) {
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 10;
          ctx.fill();
        }
      }
    }

    // Edge Vignette
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.35,
      width / 2,
      height / 2,
      width * 0.72
    );
    vignette.addColorStop(0, "transparent");
    vignette.addColorStop(1, "rgba(1, 2, 6, 0.8)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, [frame, width, height, durationInFrames, cols, rows, primaryColor, secondaryColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
