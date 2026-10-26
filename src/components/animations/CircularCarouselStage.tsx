import React, { useEffect, useState } from 'react';
// @ts-ignore - CircularCarousel is installed as a JS/JSX shadcn component from @react-bits
import CircularCarousel from '../CircularCarousel.jsx';
import { StageProps } from './PaperStormStage';

export default function CircularCarouselStage({
  config,
  isPlaying = true,
  resetTrigger = 0,
  compact = false,
  onTelemetryUpdate,
}: StageProps) {
  const preset = String(config.preset || 'cylinder');
  const rawCardWidth = Number(config.cardWidth ?? 210);
  const cardWidth = compact ? Math.round(rawCardWidth * 0.68) : rawCardWidth;
  const gap = Number(config.gap ?? 24);
  const curve = Number(config.curve ?? 1.0);
  const tilt = Number(config.tilt ?? -6);
  const speed = Number(config.speed ?? 16);
  const depthFade = Number(config.depthFade ?? 0.55);
  const captions = compact ? false : Boolean(config.captions ?? true);
  const reducedMotion = Boolean(config.reducedMotion ?? false);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    onTelemetryUpdate?.({
      fps: 60,
      rotationDeg: activeSlide * 45,
      stateLabel: isPlaying ? `3D ${preset.toUpperCase()} RING` : 'PAUSED',
    });
  }, [activeSlide, isPlaying, preset, onTelemetryUpdate]);

  return (
    <div
      className="relative w-full h-full bg-[#18181c] text-[#f3f0f5] overflow-hidden select-none flex items-center justify-center"
      data-testid="stage-circular-carousel"
    >
      {/* Subtle architectural dark grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(62, 217, 233, 0.14), transparent 70%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 36px 36px, 36px 36px',
        }}
      />

      <CircularCarousel
        key={`cc-${resetTrigger}`}
        preset={preset}
        intro="assemble"
        cardWidth={cardWidth}
        aspectRatio={1}
        gap={gap}
        curve={curve}
        tilt={tilt}
        autoplay={isPlaying && !reducedMotion ? 'drift' : 'off'}
        speed={speed}
        depthFade={depthFade}
        cornerRadius={12}
        captions={captions}
        reducedMotion={reducedMotion}
        fadeColor="#18181c"
        onChange={(idx: number) => setActiveSlide(idx)}
        className="w-full h-full"
      />
    </div>
  );
}
