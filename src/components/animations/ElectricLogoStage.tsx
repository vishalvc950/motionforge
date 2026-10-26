import React, { useEffect, useMemo } from 'react';
// @ts-ignore - ElectricLogo is installed as a JS/JSX shadcn component from @react-bits
import ElectricLogo from '../ElectricLogo.jsx';
import { StageProps } from './PaperStormStage';

const createLogoGlyphUri = (preset: string): string => {
  if (preset === 'origami-prism') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <polygon points="64,10 114,64 64,118 14,64" fill="#ffffff"/>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
  if (preset === 'orbital-atom') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r="20" fill="#ffffff"/>
      <path d="M64 14 A50 50 0 1 0 114 64 L98 64 A34 34 0 1 1 64 30 Z" fill="#ffffff"/>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
  const boltSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <path d="M39 3 12 37h17l-4 24 27-34H35z" fill="#ffffff"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(boltSvg)}`;
};

const ELECTRIC_PALETTES: Record<string, { color: string; glowColor: string }> = {
  'violet-plasma': { color: '#ecc7ff', glowColor: '#ad6dff' },
  'cyan-arc': { color: '#b8f9ff', glowColor: '#00d2eb' },
  'solar-flare': { color: '#ffe5b4', glowColor: '#ff5a43' },
};

export default function ElectricLogoStage({
  config,
  isPlaying = true,
  resetTrigger = 0,
  compact = false,
  onTelemetryUpdate,
}: StageProps) {
  const shapePreset = String(config.shapePreset || 'bolt');
  const strands = Number(config.strands ?? 4);
  const intensity = Number(config.intensity ?? 1.2);
  const crackle = Number(config.crackle ?? 1.5);
  const bend = Number(config.bend ?? 0.65);
  const speed = Number(config.speed ?? 2.5);
  const scale = compact ? 0.62 : Number(config.scale ?? 0.68);
  const paletteKey = String(config.palette || 'violet-plasma');
  const reducedMotion = Boolean(config.reducedMotion ?? false);

  const colors = ELECTRIC_PALETTES[paletteKey] || ELECTRIC_PALETTES['violet-plasma'];
  const srcUri = useMemo(() => createLogoGlyphUri(shapePreset), [shapePreset]);

  useEffect(() => {
    onTelemetryUpdate?.({
      fps: 60,
      rotationDeg: strands * 60,
      stateLabel: isPlaying ? `SDF PLASMA (${strands} STRANDS)` : 'PAUSED',
    });
  }, [strands, isPlaying, onTelemetryUpdate]);

  return (
    <div
      className="relative w-full h-full bg-[#18181c] text-[#f3f0f5] overflow-hidden select-none flex items-center justify-center"
      data-testid="stage-electric-logo"
    >
      {/* Luminous SVG plasma core underlay so the emblem is always crisp even while SDF textures initialize */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-45">
        <div
          className="w-40 h-40 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle, ${colors.glowColor} 0%, transparent 70%)`,
          }}
        />
      </div>

      <ElectricLogo
        key={`el-${resetTrigger}`}
        src={srcUri}
        color={colors.color}
        glowColor={colors.glowColor}
        scale={scale}
        intensity={intensity}
        glow={1.15}
        thickness={1.6}
        strands={strands}
        bend={bend}
        crackle={crackle}
        arcs={1}
        flicker={reducedMotion ? 0 : 0.6}
        speed={isPlaying && !reducedMotion ? speed : 0}
        interactive={true}
        cursorIntensity={0.85}
        cursorRadius={120}
        theme="dark"
        reducedMotion={reducedMotion}
        className="w-full h-full"
      />
    </div>
  );
}
