import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface AbstractFireProps {
  flameCount?: number;
  emberCount?: number;
}

export const AbstractFireLoop: React.FC<AbstractFireProps> = ({
  flameCount = 48,
  emberCount = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Seamless loop progress (0 to 1)
  const progress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = progress * Math.PI * 2;

  // Pre-generate flame tongues
  const flames = useMemo(() => {
    return Array.from({ length: flameCount }).map((_, i) => {
      const baseX = (i / flameCount) * width + (Math.sin(i * 9.1) * 60);
      const widthSpread = 120 + ((i * 37) % 180);
      const maxHeight = height * 0.75 + ((i * 53) % (height * 0.45));
      const speed = 1.0 + ((i * 13) % 10) * 0.15;
      const phase = (i * 7.3) % (Math.PI * 2);
      const colorType = i % 4; // 0: deep red, 1: bright orange, 2: golden yellow, 3: white-hot core

      return {
        id: i,
        baseX,
        widthSpread,
        maxHeight,
        speed,
        phase,
        colorType,
      };
    });
  }, [flameCount, width, height]);

  // Pre-generate ember sparks
  const embers = useMemo(() => {
    return Array.from({ length: emberCount }).map((_, i) => {
      const seedX = (Math.sin(i * 12.7) * 0.5 + 0.5) * width;
      const seedY = height * 0.95;
      const speedY = 3.0 + ((i * 17) % 25) * 0.3;
      const driftAmplitude = 40 + ((i * 29) % 80);
      const driftFreq = 1.5 + ((i * 7) % 5) * 0.4;
      const size = 2.0 + ((i * 19) % 6);
      const phase = (i * 3.14) % (Math.PI * 2);
      const color = i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#ffd166" : "#ff5400";

      return {
        id: i,
        seedX,
        seedY,
        speedY,
        driftAmplitude,
        driftFreq,
        size,
        phase,
        color,
      };
    });
  }, [emberCount, width, height]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#050100",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <filter id="fireGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="48" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="fireBaseGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fff7d6" stopOpacity="0.95" />
            <stop offset="20%" stopColor="#ffb703" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fb8500" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#d00000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#370617" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="combustionCore" cx="50%" cy="85%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#ffb703" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#d00000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Roaring Background Thermal Bed */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="url(#combustionCore)"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Licking Flame Tongues with Bezier Curvature */}
        <g filter="url(#fireGlow)" style={{ mixBlendMode: "screen" }}>
          {flames.map((f) => {
            // Harmonic loop displacement
            const wave1 = Math.sin(loopAngle * f.speed + f.phase);
            const wave2 = Math.cos(loopAngle * (f.speed * 1.5) + f.phase * 1.3);

            const flameHeight = f.maxHeight * (0.8 + 0.2 * wave1);
            const tipX = f.baseX + wave1 * 90 + wave2 * 45;
            const tipY = height - flameHeight;

            const cp1X = f.baseX - f.widthSpread * 0.6 + wave2 * 60;
            const cp1Y = height - flameHeight * 0.4;
            const cp2X = f.baseX + f.widthSpread * 0.6 - wave1 * 60;
            const cp2Y = height - flameHeight * 0.4;

            const pathD = `
              M ${f.baseX - f.widthSpread * 0.5} ${height + 20}
              C ${cp1X} ${cp1Y}, ${tipX - 15} ${tipY + 60}, ${tipX} ${tipY}
              C ${tipX + 15} ${tipY + 60}, ${cp2X} ${cp2Y}, ${f.baseX + f.widthSpread * 0.5} ${height + 20}
              Z
            `;

            let fillColor = "url(#fireBaseGrad)";
            let opacity = 0.5 + 0.3 * Math.abs(wave2);

            if (f.colorType === 2) {
              opacity = 0.7;
            } else if (f.colorType === 3) {
              opacity = 0.85;
            }

            return (
              <path
                key={f.id}
                d={pathD}
                fill={fillColor}
                opacity={opacity}
                style={{ mixBlendMode: "screen" }}
              />
            );
          })}
        </g>

        {/* High-Velocity Swirling Embers and Ash Sparks */}
        <g style={{ mixBlendMode: "screen" }}>
          {embers.map((e) => {
            // Loop displacement for embers
            const emberProgress = ((frame * e.speedY * 0.005 + (e.id / embers.length)) % 1);
            const currentY = height * 1.05 - emberProgress * (height * 1.15);
            const sway = Math.sin(emberProgress * Math.PI * 4 * e.driftFreq + e.phase) * e.driftAmplitude;
            const currentX = e.seedX + sway;
            const opacity = Math.sin(emberProgress * Math.PI) * (0.6 + 0.4 * Math.sin(frame * 0.2 + e.id));

            return (
              <circle
                key={e.id}
                cx={currentX}
                cy={currentY}
                r={e.size * (1 - emberProgress * 0.5)}
                fill={e.color}
                opacity={opacity}
                filter="url(#fireGlow)"
              />
            );
          })}
        </g>
      </svg>

      {/* Atmospheric Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 90%, transparent 40%, rgba(5,1,0,0.5) 80%, rgba(0,0,0,0.9) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
