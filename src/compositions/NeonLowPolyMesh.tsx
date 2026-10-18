import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface PlexusNetworkProps {
  nodeCount?: number;
  maxDistance?: number;
}

export const defaultLowPolyProps: PlexusNetworkProps = {
  nodeCount: 130,
  maxDistance: 290,
};

export const NeonLowPolyMesh: React.FC<PlexusNetworkProps> = ({
  nodeCount = 130,
  maxDistance = 290,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Seamless loop progress (0 to 1)
  const progress = (frame % durationInFrames) / durationInFrames;
  const loopAngle = progress * Math.PI * 2;

  // Deterministically pre-generate 3D nodes
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }).map((_, i) => {
      // 3D volume placement
      const baseX = (Math.sin(i * 12.9898) * 0.5 + 0.5) * (width * 1.15) - width * 0.075;
      const baseY = (Math.cos(i * 78.233) * 0.5 + 0.5) * (height * 1.15) - height * 0.075;
      const baseZ = -300 + ((i * 47) % 600); // 3D depth

      // Harmonic orbital movement for seamless loop
      const ampX = 40 + ((i * 19) % 60);
      const ampY = 35 + ((i * 23) % 55);
      const freqX = 1 + (i % 2);
      const freqY = 1 + ((i + 1) % 2);
      const phase = (i * 3.7) % (Math.PI * 2);

      // Star glint property (prominent nodes have 4-point cross sparkle like reference)
      const hasGlint = i % 5 === 0;
      const glintSize = 14 + ((i * 11) % 18);

      return {
        id: i,
        baseX,
        baseY,
        baseZ,
        ampX,
        ampY,
        freqX,
        freqY,
        phase,
        hasGlint,
        glintSize,
      };
    });
  }, [nodeCount, width, height]);

  // Compute live 3D positions for the current frame
  const liveNodes = useMemo(() => {
    return nodes.map((n) => {
      const x = n.baseX + Math.sin(loopAngle * n.freqX + n.phase) * n.ampX;
      const y = n.baseY + Math.cos(loopAngle * n.freqY + n.phase) * n.ampY;
      const z = n.baseZ + Math.sin(loopAngle + n.phase) * 60;

      // 3D Perspective Projection
      const fov = 900;
      const scale = fov / (fov + z);
      const projX = (x - width / 2) * scale + width / 2;
      const projY = (y - height / 2) * scale + height / 2;

      // Color scheme based on screen X (Left: Magenta/Pink, Right: Cyan/Blue)
      const xRatio = Math.max(0, Math.min(1, projX / width));
      // Interpolate colors: Magenta (#ff0080) -> Purple (#9b22ea) -> Sky Cyan (#00f0ff)
      let color = "#00f0ff";
      let haloColor = "rgba(0, 240, 255, 0.6)";

      if (xRatio < 0.35) {
        color = "#ff0099"; // Vibrant Magenta
        haloColor = "rgba(255, 0, 153, 0.7)";
      } else if (xRatio < 0.6) {
        color = "#a855f7"; // Glowing Purple
        haloColor = "rgba(168, 85, 247, 0.65)";
      } else {
        color = "#00e5ff"; // Electric Cyan
        haloColor = "rgba(0, 229, 255, 0.7)";
      }

      return {
        ...n,
        projX,
        projY,
        scale,
        depthAlpha: Math.max(0.2, Math.min(1, scale)),
        color,
        haloColor,
      };
    });
  }, [nodes, loopAngle, width, height]);

  // Find all connections within maxDistance
  const connections = useMemo(() => {
    const list: {
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      alpha: number;
      strokeColor: string;
    }[] = [];

    for (let i = 0; i < liveNodes.length; i++) {
      for (let j = i + 1; j < liveNodes.length; j++) {
        const n1 = liveNodes[i];
        const n2 = liveNodes[j];
        const dx = n1.projX - n2.projX;
        const dy = n1.projY - n2.projY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const proximity = 1 - dist / maxDistance;
          const alpha = proximity * Math.min(n1.depthAlpha, n2.depthAlpha) * 0.75;
          const strokeColor = (n1.projX + n2.projX) / 2 < width * 0.45 ? "#d946ef" : "#00f0ff";

          list.push({
            id: `${i}-${j}`,
            x1: n1.projX,
            y1: n1.projY,
            x2: n2.projX,
            y2: n2.projY,
            alpha,
            strokeColor,
          });
        }
      }
    }
    return list;
  }, [liveNodes, maxDistance, width]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#030611",
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
          <filter id="neonPlexusGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Deep Space Cosmic Vignette Background */}
          <radialGradient id="techCosmicBg" cx="45%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#081432" />
            <stop offset="40%" stopColor="#050c20" />
            <stop offset="85%" stopColor="#02050e" />
            <stop offset="100%" stopColor="#010206" />
          </radialGradient>
        </defs>

        {/* Ambient Dark Navy / Cyan-Tinted Background */}
        <rect width={width} height={height} fill="url(#techCosmicBg)" />

        {/* Dynamic Wireframe Interconnections */}
        <g>
          {connections.map((c) => (
            <line
              key={c.id}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke={c.strokeColor}
              strokeWidth={1.3}
              opacity={c.alpha}
              style={{ mixBlendMode: "screen" }}
            />
          ))}
        </g>

        {/* Glowing Network Nodes */}
        <g filter="url(#neonPlexusGlow)" style={{ mixBlendMode: "screen" }}>
          {liveNodes.map((n) => {
            const nodeRadius = 3.2 * n.scale;
            return (
              <g key={n.id}>
                {/* Soft outer atmospheric halo */}
                <circle
                  cx={n.projX}
                  cy={n.projY}
                  r={nodeRadius * 3.5}
                  fill={n.haloColor}
                  opacity={n.depthAlpha * 0.6}
                />

                {/* Intense white-hot core bead */}
                <circle
                  cx={n.projX}
                  cy={n.projY}
                  r={nodeRadius}
                  fill="#ffffff"
                  opacity={n.depthAlpha}
                />

                {/* 4-Point Star Lens Glint / Sparkle Cross (Reference 334822777 detail!) */}
                {n.hasGlint && (
                  <g opacity={n.depthAlpha * 0.9}>
                    {/* Horizontal ray */}
                    <line
                      x1={n.projX - n.glintSize * n.scale}
                      y1={n.projY}
                      x2={n.projX + n.glintSize * n.scale}
                      y2={n.projY}
                      stroke="#ffffff"
                      strokeWidth={1.4}
                      strokeLinecap="round"
                    />
                    {/* Vertical ray */}
                    <line
                      x1={n.projX}
                      y1={n.projY - n.glintSize * n.scale}
                      x2={n.projX}
                      y2={n.projY + n.glintSize * n.scale}
                      stroke="#ffffff"
                      strokeWidth={1.4}
                      strokeLinecap="round"
                    />
                    {/* Diagonal secondary rays */}
                    <line
                      x1={n.projX - n.glintSize * 0.45 * n.scale}
                      y1={n.projY - n.glintSize * 0.45 * n.scale}
                      x2={n.projX + n.glintSize * 0.45 * n.scale}
                      y2={n.projY + n.glintSize * 0.45 * n.scale}
                      stroke={n.color}
                      strokeWidth={1.0}
                    />
                    <line
                      x1={n.projX - n.glintSize * 0.45 * n.scale}
                      y1={n.projY + n.glintSize * 0.45 * n.scale}
                      x2={n.projX + n.glintSize * 0.45 * n.scale}
                      y2={n.projY - n.glintSize * 0.45 * n.scale}
                      stroke={n.color}
                      strokeWidth={1.0}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
