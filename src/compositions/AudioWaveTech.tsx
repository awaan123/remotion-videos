import React, { useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface AudioWaveProps {
  primaryColor: string;
  secondaryColor: string;
  waveCount: number;
  pointsPerWave: number;
  amplitude: number;
}

export const defaultAudioWaveProps: AudioWaveProps = {
  primaryColor: "#00f2fe", // Electric Cyan
  secondaryColor: "#3b82f6", // Royal Blue
  waveCount: 8,
  pointsPerWave: 90,
  amplitude: 140,
};

export const AudioWaveTech: React.FC<AudioWaveProps> = ({
  primaryColor = defaultAudioWaveProps.primaryColor,
  secondaryColor = defaultAudioWaveProps.secondaryColor,
  waveCount = defaultAudioWaveProps.waveCount,
  pointsPerWave = defaultAudioWaveProps.pointsPerWave,
  amplitude = defaultAudioWaveProps.amplitude,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas to deep dark technology backdrop
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    // Subtle center glow
    const centerGlow = ctx.createRadialGradient(
      width / 2,
      height / 2,
      20,
      width / 2,
      height / 2,
      width * 0.55
    );
    centerGlow.addColorStop(0, primaryColor + "18");
    centerGlow.addColorStop(1, "transparent");
    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, width, height);

    const centerY = height * 0.52;
    const loopPhase = (frame / durationInFrames) * Math.PI * 2;

    // Draw multiple undulating harmonic waves (Fiber Optic / Audio Wave pattern)
    for (let w = 0; w < waveCount; w++) {
      const waveOffset = w * 0.35;
      const alpha = 0.9 - (w / waveCount) * 0.5;

      ctx.beginPath();
      ctx.lineWidth = w === 0 ? 3.5 : 2.0;

      const grad = ctx.createLinearGradient(0, centerY, width, centerY);
      grad.addColorStop(0, primaryColor + "22");
      grad.addColorStop(0.5, primaryColor);
      grad.addColorStop(1, secondaryColor + "22");
      ctx.strokeStyle = grad;

      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = w === 0 ? 16 : 8;

      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= pointsPerWave; i++) {
        const x = (i / pointsPerWave) * width;
        const normalizedX = (i / pointsPerWave) * Math.PI * 4;

        // Harmonic oscillation formula (seamless over duration)
        const sin1 = Math.sin(normalizedX + loopPhase + waveOffset);
        const sin2 = Math.sin(normalizedX * 2 - loopPhase * 2 + waveOffset) * 0.4;
        const envelope = Math.sin((i / pointsPerWave) * Math.PI); // Pin ends to zero

        const y = centerY + (sin1 + sin2) * amplitude * envelope * (1 - w * 0.08);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        points.push({ x, y });
      }
      ctx.globalAlpha = alpha;
      ctx.stroke();

      // Glowing data points along the primary wave
      if (w === 0 || w === 1) {
        ctx.fillStyle = "#ffffff";
        for (let j = 0; j < points.length; j += 4) {
          const pt = points[j];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }, [frame, width, height, durationInFrames, primaryColor, secondaryColor, waveCount, pointsPerWave, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
