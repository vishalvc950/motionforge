import React, { useEffect, useState } from 'react';
import { AnimationConfig } from '../../registry/types';
import { StageProps } from './PaperStormStage';

const PALETTES: Record<
  string,
  {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
    paperFill: string;
    ink: string;
  }
> = {
  'botanical-crayon': {
    bg: '#f6f2f8',
    primary: '#b52515',
    secondary: '#006971',
    accent: '#ffc83b',
    paperFill: '#ffdad4',
    ink: '#1b1b1f',
  },
  'cobalt-studio': {
    bg: '#f0edf2',
    primary: '#5d48ca',
    secondary: '#006971',
    accent: '#ff5a43',
    paperFill: '#e5deff',
    ink: '#190064',
  },
  'archival-charcoal': {
    bg: '#efe9de',
    primary: '#1b1b1f',
    secondary: '#5a403c',
    accent: '#8f706b',
    paperFill: '#e2dacb',
    ink: '#0f0f12',
  },
};

export default function LivingSvgStage({
  config,
  isPlaying = true,
  explodeTrigger = 0,
  resetTrigger = 0,
  scrubProgress = null,
}: StageProps) {
  const duration = Number(config.duration ?? 1.6);
  const staggerDelay = Number(config.staggerDelay ?? 0.18);
  const strokeWidth = Number(config.strokeWidth ?? 2.5);
  const fillOpacity = Number(config.fillOpacity ?? 0.85);
  const roughness = Number(config.roughness ?? 1.8);
  const paletteKey = String(config.palette ?? 'botanical-crayon');
  const reducedMotion = Boolean(config.reducedMotion);

  const [cycleKey, setCycleKey] = useState(0);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(1);

  const colors = PALETTES[paletteKey] || PALETTES['botanical-crayon'];
  const totalTime = duration + staggerDelay * 5;

  useEffect(() => {
    if (explodeTrigger > 0 || resetTrigger > 0) {
      setCycleKey((k) => k + 1);
      setProgress(0);
    }
  }, [explodeTrigger, resetTrigger]);

  useEffect(() => {
    const prefersReduced =
      reducedMotion ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    if (prefersReduced) {
      setProgress(1);
      return;
    }

    if (scrubProgress !== null) {
      setProgress(scrubProgress);
      return;
    }

    if (!isPlaying) return;

    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = ((now - start) / 1000) % (totalTime + 0.9);
      const norm = Math.min(1, elapsed / totalTime);
      setProgress(norm);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [duration, staggerDelay, totalTime, isPlaying, reducedMotion, scrubProgress, cycleKey]);

  const computePathDashoffset = (index: number) => {
    if (reducedMotion) return 0;
    const currentSec = progress * totalTime;
    const startSec = index * staggerDelay;
    const raw = (currentSec - startSec) / Math.max(0.2, duration);
    const clamped = Math.max(0, Math.min(1, raw));
    // Smooth cubic ease-out
    const eased = 1 - Math.pow(1 - clamped, 3);
    return Number((1 - eased).toFixed(3));
  };

  const currentFillOpacity = reducedMotion
    ? fillOpacity
    : Math.max(0, Math.min(1, (progress - 0.35) / 0.55)) * fillOpacity;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none drafting-grid-light transition-colors duration-300"
      style={{ backgroundColor: colors.bg }}
      onPointerMove={(e) => {
        if (reducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
        setPointerOffset({ x: nx, y: ny });
      }}
      onPointerLeave={() => setPointerOffset({ x: 0, y: 0 })}
      onClick={() => setCycleKey((k) => k + 1)}
      data-testid="stage-living-svg"
      role="img"
      aria-label={`LivingSVG hand-drawn vector illustration using ${paletteKey} palette`}
    >
      <svg
        key={cycleKey}
        viewBox="0 0 360 240"
        className="w-full h-full max-w-[360px] max-h-[240px] overflow-visible"
      >
        <defs>
          <filter id="living-svg-crayon-filter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.55"
              numOctaves="3"
              seed="14"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={roughness}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g filter={roughness > 0.05 ? 'url(#living-svg-crayon-filter)' : undefined}>
          {/* Cut-paper geometric backdrop shapes */}
          <g
            style={{
              opacity: currentFillOpacity,
              transform: `translate(${(pointerOffset.x * -0.5).toFixed(1)}px, ${(
                pointerOffset.y * -0.5
              ).toFixed(1)}px)`,
              transition: 'transform 120ms ease-out',
            }}
          >
            {/* Sun / Moon Cutout */}
            <circle cx="180" cy="54" r="32" fill={colors.accent} fillOpacity="0.55" />
            {/* Left Botanical Leaf Cutout */}
            <path
              d="M180 198 C164 148, 122 106, 82 72 C122 92, 158 134, 180 198 Z"
              fill={colors.secondary}
              fillOpacity="0.28"
            />
            {/* Right Botanical Petal Cutout */}
            <path
              d="M180 178 C198 132, 238 96, 276 68 C242 108, 208 144, 180 178 Z"
              fill={colors.primary}
              fillOpacity="0.26"
            />
            {/* Architectural Arch Base */}
            <path
              d="M132 212 L228 212 L216 182 L144 182 Z"
              fill={colors.paperFill}
              fillOpacity="0.85"
            />
          </g>

          {/* Hand-drawn staggered vector paths */}
          <g
            style={{
              transform: `translate(${(pointerOffset.x * 0.35).toFixed(1)}px, ${(
                pointerOffset.y * 0.35
              ).toFixed(1)}px)`,
              transition: 'transform 120ms ease-out',
            }}
          >
            {/* Path 0: Central Botanical Stem */}
            <path
              pathLength={1}
              d="M180 212 Q180 124 180 34"
              fill="none"
              stroke={colors.ink}
              strokeWidth={strokeWidth + 0.5}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={computePathDashoffset(0)}
            />
            {/* Path 1: Left Leaf Contour */}
            <path
              pathLength={1}
              d="M180 196 C164 146, 120 104, 80 70 C120 90, 156 132, 180 196 Z"
              fill="none"
              stroke={colors.secondary}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={1}
              strokeDashoffset={computePathDashoffset(1)}
            />
            {/* Path 2: Right Leaf Contour */}
            <path
              pathLength={1}
              d="M180 176 C198 130, 238 94, 276 66 C242 106, 208 142, 180 176 Z"
              fill="none"
              stroke={colors.primary}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={1}
              strokeDashoffset={computePathDashoffset(2)}
            />
            {/* Path 3: Sun Halo Ring */}
            <circle
              pathLength={1}
              cx="180"
              cy="54"
              r="28"
              fill="none"
              stroke={colors.primary}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={1}
              strokeDashoffset={computePathDashoffset(3)}
            />
            {/* Path 4: Drafting Compass Arc & Geometric Frame */}
            <path
              pathLength={1}
              d="M64 148 A120 120 0 0 1 296 148"
              fill="none"
              stroke={colors.ink}
              strokeWidth={Math.max(1, strokeWidth * 0.65)}
              strokeDasharray={1}
              strokeDashoffset={computePathDashoffset(4)}
            />
            {/* Path 5: Terracotta Pedestal */}
            <path
              pathLength={1}
              d="M128 212 L232 212 L218 180 L142 180 Z"
              fill="none"
              stroke={colors.ink}
              strokeWidth={strokeWidth * 0.85}
              strokeLinejoin="round"
              strokeDasharray={1}
              strokeDashoffset={computePathDashoffset(5)}
            />

            {/* Registration Nodes */}
            <circle cx="180" cy="34" r="4" fill={colors.primary} />
            <circle cx="80" cy="70" r="3.5" fill={colors.secondary} />
            <circle cx="276" cy="66" r="3.5" fill={colors.primary} />
          </g>
        </g>
      </svg>
    </div>
  );
}
