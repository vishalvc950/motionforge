import React, { useEffect, useState } from 'react';
// @ts-ignore - HoldButton is installed as a JS/JSX shadcn component from @react-bits
import HoldButton from '../HoldButton.jsx';
import { StageProps } from './PaperStormStage';
import { CheckCircle2, Flame, ShieldAlert, Zap } from 'lucide-react';

const HOLD_PALETTES: Record<
  string,
  { bg: string; fill: string; text: string; fillText: string; label: string; doneLabel: string }
> = {
  'origami-coral': {
    bg: '#27272e',
    fill: '#ff5a43',
    text: '#f3f0f5',
    fillText: '#ffffff',
    label: 'Hold to Deploy Rig',
    doneLabel: 'Rig Deployed',
  },
  'violet-surge': {
    bg: '#232030',
    fill: '#5227FF',
    text: '#f5f5f5',
    fillText: '#ffffff',
    label: 'Hold to Arm Core',
    doneLabel: 'Core Armed',
  },
  'blueprint-cyan': {
    bg: '#1c282c',
    fill: '#006971',
    text: '#e4f9fc',
    fillText: '#88f3ff',
    label: 'Hold to Calibrate',
    doneLabel: 'Calibrated',
  },
};

export default function HoldButtonStage({
  config,
  isPlaying = true,
  resetTrigger = 0,
  compact = false,
  onTelemetryUpdate,
}: StageProps) {
  const fillDirection = String(config.fillDirection || 'right') as 'right' | 'up';
  const holdTime = Number(config.holdTime ?? 1600);
  const releaseTime = Number(config.releaseTime ?? 220);
  const waveAmplitude = Number(config.waveAmplitude ?? 7);
  const radius = Number(config.radius ?? 14);
  const pressScale = Number(config.pressScale ?? 0.96);
  const paletteKey = String(config.palette || 'origami-coral');
  const glow = Boolean(config.glow ?? true);
  const reducedMotion = Boolean(config.reducedMotion ?? false);

  const palette = HOLD_PALETTES[paletteKey] || HOLD_PALETTES['origami-coral'];
  const [holdCount, setHoldCount] = useState(0);
  const [tapNotice, setTapNotice] = useState(false);

  useEffect(() => {
    onTelemetryUpdate?.({
      fps: 60,
      rotationDeg: holdCount * 90,
      stateLabel: `HOLD ${holdTime}MS (${fillDirection.toUpperCase()})`,
    });
  }, [holdCount, holdTime, fillDirection, onTelemetryUpdate]);

  return (
    <div
      className="relative w-full h-full bg-[#18181c] text-[#f3f0f5] overflow-hidden select-none flex flex-col items-center justify-center p-4"
      data-testid="stage-hold-button"
    >
      {/* Tactile studio grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(255, 90, 67, 0.16), transparent 68%), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {!compact && (
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#dcd9de]/80 uppercase tracking-wider">
            <span>PRESS & HOLD INTERACTION SPECIMEN</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#88f3ff] tabular-nums">CONFIRMED: {holdCount}x</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <HoldButton
            key={`hb-main-${resetTrigger}-${paletteKey}-${fillDirection}`}
            size={compact ? 'md' : 'lg'}
            backgroundColor={palette.bg}
            fillColor={palette.fill}
            textColor={palette.text}
            fillTextColor={palette.fillText}
            radius={radius}
            fillDirection={fillDirection}
            holdTime={holdTime}
            releaseTime={releaseTime}
            pressScale={reducedMotion ? 1 : pressScale}
            wave={!reducedMotion && waveAmplitude > 0}
            waveAmplitude={waveAmplitude}
            glow={glow}
            icon={<Flame className="w-4 h-4" />}
            doneIcon={<CheckCircle2 className="w-4 h-4" />}
            doneLabel={palette.doneLabel}
            onHold={() => {
              setHoldCount((c) => c + 1);
              setTapNotice(false);
            }}
            onTap={() => setTapNotice(true)}
          >
            {palette.label}
          </HoldButton>

          {!compact && (
            <HoldButton
              key={`hb-alt-${resetTrigger}-${fillDirection}`}
              size="md"
              backgroundColor="#23232b"
              fillColor={fillDirection === 'up' ? '#ff5a43' : '#006971'}
              textColor="#e4e1e7"
              fillTextColor="#ffffff"
              radius={radius}
              fillDirection={fillDirection === 'right' ? 'up' : 'right'}
              holdTime={Math.max(600, Math.round(holdTime * 0.75))}
              releaseTime={releaseTime}
              pressScale={reducedMotion ? 1 : pressScale}
              wave={!reducedMotion && waveAmplitude > 0}
              waveAmplitude={waveAmplitude}
              glow={glow}
              icon={<Zap className="w-3.5 h-3.5" />}
              doneIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              doneLabel="Purged"
              onHold={() => setHoldCount((c) => c + 1)}
            >
              Hold ({fillDirection === 'right' ? 'Up Fill' : 'Right Fill'})
            </HoldButton>
          )}
        </div>

        {!compact && (
          <div className="font-mono text-xs text-[#e4e1e7]/75 flex items-center gap-2 h-5">
            {tapNotice ? (
              <span className="text-[#ffb4a7] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Short tap detected — keep holding for {(holdTime / 1000).toFixed(1)}s to complete liquid wave fill
              </span>
            ) : (
              <span>
                Hold pointer or Space/Enter for {(holdTime / 1000).toFixed(1)}s · Wave Crest: {waveAmplitude}px · Direction: {fillDirection}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
