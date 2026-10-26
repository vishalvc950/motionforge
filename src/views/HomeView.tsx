import React, { useState } from 'react';
import {
  getAllAnimations,
  getAnimationById,
} from '../registry/animations';
import { generateExportBundle } from '../registry/exporters';
import { AnimationId } from '../registry/types';
import AnimationStageRenderer from '../components/animations/AnimationStageRenderer';
import { AppRoute } from '../components/layout/Navbar';
import {
  Sliders,
  Copy,
  Check,
  Play,
  RotateCcw,
  Zap,
  ArrowRight,
  BookOpen,
  Code2,
} from 'lucide-react';

export interface HomeViewProps {
  onNavigate: (route: AppRoute, animId?: AnimationId) => void;
  onNotify: (msg: string) => void;
}

export default function HomeView({ onNavigate, onNotify }: HomeViewProps) {
  const heroAnim = getAnimationById('paper-storm');
  const [heroConfig, setHeroConfig] = useState(heroAnim.defaultConfig);
  const [explodeTrigger, setExplodeTrigger] = useState(0);
  const [assembleTrigger, setAssembleTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isExplodedState, setIsExplodedState] = useState(false);
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    rotationDeg: 34.2,
    stateLabel: 'EQUILIBRIUM',
  });
  const [copiedHeroCode, setCopiedHeroCode] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  const allAnimations = getAllAnimations();

  const handleToggleExplode = () => {
    if (isExplodedState) {
      setAssembleTrigger((n) => n + 1);
      setIsExplodedState(false);
    } else {
      setExplodeTrigger((n) => n + 1);
      setIsExplodedState(true);
    }
  };

  const handleResetHero = () => {
    setHeroConfig(heroAnim.defaultConfig);
    setResetTrigger((n) => n + 1);
    setIsExplodedState(false);
    setIsPlaying(true);
    onNotify('Reset PaperStorm stage to calibrated defaults');
  };

  const handleCopyHeroReact = async () => {
    const bundle = generateExportBundle('paper-storm', heroConfig, 'react');
    try {
      await navigator.clipboard.writeText(bundle.code);
    } catch {
      // ignore clipboard permissions error
    }
    setCopiedHeroCode(true);
    onNotify('Copied PaperStorm React component to clipboard');
    window.setTimeout(() => setCopiedHeroCode(false), 2000);
  };

  const handleCopyCli = async () => {
    const cmd = 'npm i @motionforge/react @motionforge/core';
    try {
      await navigator.clipboard.writeText(cmd);
    } catch {
      // ignore
    }
    setCopiedCli(true);
    onNotify('Copied install command to clipboard');
    window.setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-12">
      {/* 1. Split Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Editorial Positioning & Call to Action */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#006971] font-semibold tracking-wider uppercase">
              <span>Open-Source Animation Laboratory</span>
              <span aria-hidden="true">·</span>
              <span>MIT Licensed</span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#1b1b1f] tracking-tight leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Extraordinary web animations, crafted for engineers.
            </h1>

            <p className="text-base sm:text-lg text-[#5a403c] leading-relaxed max-w-xl">
              Explore advanced motion. Customize every detail. Export production-ready
              React Three Fiber, WebGL shaders, Canvas 2D, and hand-drawn SVG animations
              for your own projects.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('playground', 'paper-storm')}
              className="h-11 px-6 rounded-lg bg-[#ff5a43] hover:bg-[#e04832] text-white font-display font-semibold text-sm flex items-center gap-2 shadow-[2px_2px_0px_#1b1b1f] border border-[#1b1b1f] transition-transform active:translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <Sliders className="w-4 h-4" aria-hidden="true" />
              <span>Customize in Playground</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="h-11 px-5 rounded-lg bg-[#f0edf2] hover:bg-[#e4e1e7] text-[#1b1b1f] font-display font-semibold text-sm flex items-center gap-2 border border-[#1b1b1f]/20 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('docs')}
              className="h-11 px-4 rounded-lg text-[#5a403c] hover:text-[#1b1b1f] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Read Docs</span>
            </button>
          </div>

          {/* Quantitative Engineering Specs */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1b1b1f]/12">
            <div className="bg-[#f0edf2] rounded-lg p-3 flex flex-col">
              <span className="font-mono text-sm font-semibold text-[#b52515] tabular-nums">
                0.0 kB
              </span>
              <span className="font-mono text-[11px] text-[#5a403c] uppercase tracking-wider mt-0.5">
                Lock-in Overhead
              </span>
            </div>
            <div className="bg-[#f0edf2] rounded-lg p-3 flex flex-col">
              <span className="font-mono text-sm font-semibold text-[#006971] tabular-nums">
                60 FPS
              </span>
              <span className="font-mono text-[11px] text-[#5a403c] uppercase tracking-wider mt-0.5">
                Calibrated Loops
              </span>
            </div>
            <div className="bg-[#f0edf2] rounded-lg p-3 flex flex-col">
              <span className="font-mono text-sm font-semibold text-[#5d48ca] tabular-nums">
                4 Formats
              </span>
              <span className="font-mono text-[11px] text-[#5a403c] uppercase tracking-wider mt-0.5">
                Verified Exports
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Showcase Card (PaperStorm) */}
        <div className="lg:col-span-6 flex flex-col bg-white border border-[#1b1b1f]/20 rounded-xl shadow-[3px_3px_0px_#1b1b1f] overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#eae7ed] px-4 py-2.5 flex items-center justify-between gap-2 border-b border-[#1b1b1f]/15">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-mono text-xs font-semibold text-[#b52515] uppercase tracking-wider whitespace-nowrap shrink-0">
                01.
              </span>
              <span className="font-display font-semibold text-base text-[#1b1b1f] whitespace-nowrap">
                PaperStorm
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#5a403c] whitespace-nowrap shrink-0">
              <span>3D Origami</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{heroConfig.fragments} Shards</span>
            </div>
          </div>

          {/* Interactive Stage */}
          <div className="relative w-full h-72 sm:h-80 bg-[#18181c]">
            <AnimationStageRenderer
              animationId="paper-storm"
              config={heroConfig}
              isPlaying={isPlaying}
              explodeTrigger={explodeTrigger}
              assembleTrigger={assembleTrigger}
              resetTrigger={resetTrigger}
              onTelemetryUpdate={setTelemetry}
            />

            {/* Coordinate & Telemetry Readouts */}
            <div className="pointer-events-none absolute top-2.5 left-3 flex flex-col font-mono text-[11px] text-[#e4e1e7]/75 tabular-nums">
              <span>Δt: 16.6ms ({telemetry.fps} FPS)</span>
              <span>θ: {telemetry.rotationDeg.toFixed(1)}°</span>
            </div>
            <div className="pointer-events-none absolute top-2.5 right-3 font-mono text-[11px] text-[#88f3ff] tabular-nums">
              STATE: {isExplodedState ? 'DISPERSED' : telemetry.stateLabel}
            </div>

            {/* Mechanical HUD Transport Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#232329]/95 border border-white/15 px-3 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleExplode}
                  className="h-8 px-3 bg-[#ff5a43] hover:bg-[#e04832] rounded text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isExplodedState ? 'Fold' : 'Explode'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? 'Pause rotation' : 'Resume rotation'}
                  className={`h-8 px-2.5 rounded font-mono text-xs uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                    isPlaying
                      ? 'bg-white/15 text-white hover:bg-white/25'
                      : 'bg-[#3ed9e9] text-[#001f23] font-semibold'
                  }`}
                >
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setHeroConfig((prev) => ({
                      ...prev,
                      reducedMotion: !prev.reducedMotion,
                    }))
                  }
                  className={`hidden sm:inline-flex h-8 px-2.5 rounded font-mono text-[11px] uppercase tracking-wider items-center transition-colors cursor-pointer whitespace-nowrap ${
                    heroConfig.reducedMotion
                      ? 'bg-[#88f3ff] text-[#001f23] font-semibold'
                      : 'bg-white/10 text-[#dcd9de] hover:text-white'
                  }`}
                >
                  {heroConfig.reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetHero}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded font-mono text-[11px] text-[#e4e1e7] uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                >
                  [Reset]
                </button>
              </div>
            </div>
          </div>

          {/* Stage Footer Description & Quick Actions */}
          <div className="p-4 flex flex-col justify-between gap-4 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#5a403c]">
              <span>180 Facets · Coordinated 3D Transforms · R3F + Three.js</span>
              <span className="text-[#006971] font-semibold">Drag stage to deform</span>
            </div>
            <p className="text-sm text-[#5a403c]">
              Subdivision surface morph based on Voronoi facet centroids. Features kinetic
              spatial damping and programmatic paper crease shading.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('playground', 'paper-storm')}
                className="h-10 bg-[#ff5a43] hover:bg-[#e04832] text-white rounded-lg font-display font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sliders className="w-4 h-4" aria-hidden="true" />
                <span>Customize in Playground</span>
              </button>
              <button
                type="button"
                onClick={handleCopyHeroReact}
                className="h-10 bg-[#18181c] hover:bg-[#2c2c34] text-[#f3f0f5] rounded-lg font-display font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                {copiedHeroCode ? (
                  <>
                    <Check className="w-4 h-4 text-[#88f3ff]" aria-hidden="true" />
                    <span>Copied Component!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#88f3ff]" aria-hidden="true" />
                    <span>Copy React Component</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Signature Lab Modules (All 4 Core Animations) */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#1b1b1f]/12 pb-3">
          <div>
            <span className="font-mono text-xs font-semibold text-[#b52515] uppercase tracking-wider">
              Signature Rigs
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1b1b1f]">
              Precision Lab Modules
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#5a403c] tabular-nums">
              0{allAnimations.length} Verified Engines
            </span>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="font-mono text-xs font-semibold text-[#b52515] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allAnimations.map((anim) => (
            <article
              key={anim.id}
              className="bg-white border border-[#1b1b1f]/15 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#1b1b1f]/40 transition-colors"
            >
              <div>
                {/* Mini Live Stage Preview */}
                <div className="h-44 w-full border-b border-[#1b1b1f]/10 relative overflow-hidden">
                  <AnimationStageRenderer
                    animationId={anim.id}
                    config={anim.defaultConfig}
                    isPlaying={true}
                    compact={true}
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#5a403c]">
                    <span>
                      {anim.indexNumber}. {anim.category}
                    </span>
                    <span className="tabular-nums">
                      {anim.performanceProfile.bundleSizeKb} kB
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[#1b1b1f]">
                    {anim.name}
                  </h3>

                  <p className="text-xs text-[#5a403c] leading-relaxed line-clamp-3">
                    {anim.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-3">
                <div className="text-[11px] font-mono text-[#006971]">
                  Exports: React · Vanilla · TS · JSON
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('playground', anim.id)}
                    className="flex-1 h-9 px-3 rounded-lg bg-[#f0edf2] hover:bg-[#e4e1e7] text-[#1b1b1f] font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 text-[#b52515]" aria-hidden="true" />
                    <span>Playground</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('detail', anim.id)}
                    className="h-9 px-3 rounded-lg border border-[#1b1b1f]/15 hover:bg-[#f6f2f8] text-[#1b1b1f] font-mono text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Quick Start CLI & Architectural Philosophy */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Quick Start CLI */}
        <div className="lg:col-span-5 bg-[#18181c] text-[#f3f0f5] rounded-xl p-6 flex flex-col justify-between space-y-4 border border-[#1b1b1f]">
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-[#dcd9de]">
              <span>QUICK START CLI</span>
              <span className="text-[#88f3ff]">ESM & TREE-SHAKEABLE</span>
            </div>

            <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between gap-2 border border-white/10">
              <div className="font-mono text-xs sm:text-sm text-white truncate">
                <span className="text-[#ffb4a7] select-none mr-2">$</span>
                <span>npm i @motionforge/react @motionforge/core</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCli}
                aria-label="Copy NPM Install Command"
                className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded text-xs font-mono text-white shrink-0 transition-colors cursor-pointer"
              >
                {copiedCli ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <pre className="font-mono text-xs text-[#dcd9de]/85 leading-relaxed overflow-x-auto pt-2">
              <code>{`import { PaperStorm, LivingSVG } from '@motionforge/react';

// Hardware-calibrated with automatic reduced-motion fallback
export function StudioHero() {
  return <PaperStorm fragments={180} intensity={1.4} palette="origami-sunset" />;
}`}</code>
            </pre>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-xs">
            <span className="text-[#dcd9de]/70">Zero wrapper lock-in</span>
            <button
              type="button"
              onClick={() => onNavigate('docs')}
              className="text-[#ffb4a7] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Installation Guide</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Architectural Philosophy */}
        <div className="lg:col-span-7 bg-[#f6f2f8] border border-[#1b1b1f]/15 rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-[#1b1b1f]">
              Architectural Philosophy
            </h3>
            <span className="font-mono text-xs text-[#5a403c] uppercase">
              Open-Source Standard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-[#1b1b1f]/10 space-y-1.5">
              <h4 className="font-display font-semibold text-sm text-[#1b1b1f]">
                100% Standalone Code
              </h4>
              <p className="text-xs text-[#5a403c] leading-relaxed">
                Every exported React, Vanilla JS, or GLSL module runs independently
                without requiring the MotionForge editor shell.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#1b1b1f]/10 space-y-1.5">
              <h4 className="font-display font-semibold text-sm text-[#1b1b1f]">
                Calibrated Performance
              </h4>
              <p className="text-xs text-[#5a403c] leading-relaxed">
                DPR clamping, instanced geometry, and deterministic cleanup hooks prevent
                memory leaks and thermal throttling.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#1b1b1f]/10 space-y-1.5">
              <h4 className="font-display font-semibold text-sm text-[#1b1b1f]">
                Motion Sensitivity
              </h4>
              <p className="text-xs text-[#5a403c] leading-relaxed">
                Honors prefers-reduced-motion out of the box and provides graceful
                Canvas 2D fallbacks when WebGL is unavailable.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1b1b1f]/10 font-mono text-xs">
            <span className="text-[#5a403c]">
              COMMUNITY LICENSED · CONTRIBUTOR FRIENDLY REGISTRY
            </span>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="text-[#b52515] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Read Contributor Manifesto</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
