import React, { useEffect } from 'react';
// @ts-ignore - TechText is installed as a JS/JSX shadcn component from @react-bits
import TechText from '../TechText.jsx';
import { StageProps } from './PaperStormStage';

const TECH_PALETTES: Record<string, { color: string; accentColor: string }> = {
  'cyan-cad': { color: '#f3f0f5', accentColor: '#3ed9e9' },
  'coral-draft': { color: '#fbf8fe', accentColor: '#ff5a43' },
  'violet-spec': { color: '#f3f0f5', accentColor: '#9281ff' },
};

export default function TechTextStage({
  config,
  isPlaying = true,
  resetTrigger = 0,
  compact = false,
  onTelemetryUpdate,
}: StageProps) {
  const textPreset = String(config.textPreset || 'MOTION FORGE');
  const rawFontSize = Number(config.fontSize ?? 130);
  const fontSize = compact ? Math.round(rawFontSize * 0.55) : rawFontSize;
  const reach = Number(config.reach ?? 200);
  const strokeWidth = Number(config.strokeWidth ?? 1.6);
  const dashLength = Number(config.dashLength ?? 4);
  const specks = Number(config.specks ?? 16);
  const speed = Number(config.speed ?? 1.2);
  const paletteKey = String(config.palette || 'cyan-cad');
  const guides = compact ? false : Boolean(config.guides ?? true);
  const labels = compact ? false : Boolean(config.labels ?? true);
  const reducedMotion = Boolean(config.reducedMotion ?? false);

  const colors = TECH_PALETTES[paletteKey] || TECH_PALETTES['cyan-cad'];

  useEffect(() => {
    onTelemetryUpdate?.({
      fps: 60,
      rotationDeg: reach,
      stateLabel: isPlaying ? `CAD GLYPH LENS (${textPreset})` : 'STATIC SPECIMEN',
    });
  }, [reach, textPreset, isPlaying, onTelemetryUpdate]);

  return (
    <div
      className="relative w-full h-full bg-[#18181c] text-[#f3f0f5] overflow-hidden select-none flex items-center justify-center"
      data-testid="stage-tech-text"
    >
      <TechText
        key={`tt-${resetTrigger}-${textPreset}`}
        text={textPreset}
        fontFamily="Space Grotesk, sans-serif"
        fontWeight={700}
        fontSize={fontSize}
        letterSpacing={-0.04}
        color={colors.color}
        accentColor={colors.accentColor}
        align="center"
        reach={reach}
        softness={0.7}
        dashLength={dashLength}
        dashGap={2}
        strokeWidth={strokeWidth}
        lineStyle="dashed"
        reveal="letter"
        specks={specks}
        selection={true}
        labels={labels}
        draggable={true}
        bounce={0.45}
        sweep={isPlaying && !reducedMotion}
        speed={isPlaying && !reducedMotion ? speed : 0}
        clickKick={!reducedMotion}
        intro={reducedMotion ? 'none' : 'Wave'}
        introDuration={1.4}
        guides={guides}
        reducedMotion={reducedMotion}
        className="w-full h-full"
      />
    </div>
  );
}
