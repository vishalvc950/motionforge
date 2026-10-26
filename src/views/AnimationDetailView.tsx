import React, { useState } from 'react';
import {
  getAllAnimations,
  getAnimationById,
  serializeConfigToQuery,
  validateAndClampConfig,
} from '../registry/animations';
import { AnimationConfig, AnimationId } from '../registry/types';
import AnimationStageRenderer from '../components/animations/AnimationStageRenderer';
import ParameterEditor from '../components/editor/ParameterEditor';
import CodeExporterPanel from '../components/editor/CodeExporterPanel';
import { AppRoute } from '../components/layout/Navbar';
import {
  ArrowLeft,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Cpu,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export interface AnimationDetailViewProps {
  animationId: AnimationId;
  config: AnimationConfig;
  onUpdateConfig: (nextConfig: AnimationConfig) => void;
  onNavigate: (route: AppRoute, animId?: AnimationId, config?: AnimationConfig) => void;
  onNotify: (msg: string) => void;
}

export default function AnimationDetailView({
  animationId,
  config,
  onUpdateConfig,
  onNavigate,
  onNotify,
}: AnimationDetailViewProps) {
  const anim = getAnimationById(animationId);
  const relatedAnimations = getAllAnimations().filter((a) => a.id !== anim.id);

  const [isPlaying, setIsPlaying] = useState(true);
  const [explodeTrigger, setExplodeTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [viewportWidth, setViewportWidth] = useState<'390px' | '768px' | 'FULL'>('FULL');

  const handleFieldChange = (key: string, value: number | string | boolean) => {
    const next = validateAndClampConfig(anim.id, { ...config, [key]: value });
    onUpdateConfig(next);
  };

  const handleReset = () => {
    onUpdateConfig(anim.defaultConfig);
    setResetTrigger((n) => n + 1);
    setIsPlaying(true);
    onNotify(`Reset ${anim.name} configuration to defaults`);
  };

  const handleShare = async () => {
    const qs = serializeConfigToQuery(anim.id, config);
    const url = `${window.location.origin}${window.location.pathname}?${qs}#detail`;
    window.history.replaceState(null, '', `?${qs}#detail`);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
    onNotify('Copied shareable configuration link!');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-10">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1b1b1f]/15 pb-6">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="font-mono text-xs text-[#5a403c] hover:text-[#1b1b1f] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Gallery</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#b52515] uppercase tracking-wider">
            <span>Module {anim.indexNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{anim.category}</span>
            <span aria-hidden="true">·</span>
            <span>v{anim.version}</span>
            <span aria-hidden="true">·</span>
            <span>{anim.license} License</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b1b1f] tracking-tight">
            {anim.name} — {anim.subtitle}
          </h1>
          <p className="text-base text-[#5a403c] max-w-3xl leading-relaxed">
            {anim.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('playground', anim.id, config)}
            className="h-11 px-5 rounded-xl bg-[#ff5a43] hover:bg-[#e04832] text-white font-display font-semibold text-sm flex items-center gap-2 shadow-[2px_2px_0px_#1b1b1f] border border-[#1b1b1f] transition-transform active:translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <Sliders className="w-4 h-4" aria-hidden="true" />
            <span>Open in Full Playground</span>
          </button>
        </div>
      </div>

      {/* Live Demonstration + Configuration Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Live Stage Box */}
          <div className="bg-[#18181c] rounded-xl overflow-hidden border border-[#1b1b1f] shadow-md">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#232329] text-[#f3f0f5] border-b border-white/10">
              <div className="font-mono text-xs text-[#88f3ff]">
                LIVE DEMONSTRATION · {anim.performanceProfile.renderingEngine}
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded p-0.5">
                {(['390px', '768px', 'FULL'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setViewportWidth(w)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] cursor-pointer ${
                      viewportWidth === w
                        ? 'bg-[#006971] text-[#88f3ff] font-semibold'
                        : 'text-[#dcd9de]/75 hover:text-white'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full bg-[#121216] flex justify-center overflow-hidden">
              <div
                className="relative h-80 sm:h-96 transition-all duration-300"
                style={{
                  width:
                    viewportWidth === '390px'
                      ? '390px'
                      : viewportWidth === '768px'
                      ? '768px'
                      : '100%',
                }}
              >
                <AnimationStageRenderer
                  animationId={anim.id}
                  config={config}
                  isPlaying={isPlaying}
                  explodeTrigger={explodeTrigger}
                  resetTrigger={resetTrigger}
                  onResetConfig={handleReset}
                />
              </div>
            </div>

            {/* Playback & Reset Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#232329] border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="h-9 px-3.5 rounded-lg bg-white text-[#1b1b1f] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-[#b52515]" aria-hidden="true" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-[#b52515]" aria-hidden="true" />
                      <span>Play</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setExplodeTrigger((n) => n + 1)}
                  className="h-9 px-3.5 rounded-lg bg-[#ff5a43] text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{anim.id === 'living-svg' ? 'Replay Draw' : 'Trigger Impulse'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="h-9 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Real Code Export Section */}
          <CodeExporterPanel
            animationId={anim.id}
            config={config}
            onNotify={onNotify}
          />
        </div>

        {/* Right Column: Parameter Editor & Technical Specs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Presets */}
          <div className="bg-[#f6f2f8] border border-[#1b1b1f]/15 rounded-xl p-4 space-y-2.5">
            <span className="font-mono text-xs font-semibold text-[#5a403c] uppercase tracking-wider">
              Calibrated Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {anim.presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onUpdateConfig(preset.values);
                    onNotify(`Loaded ${preset.name} preset`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#eae7ed] border border-[#1b1b1f]/15 font-mono text-xs text-[#1b1b1f] cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <ParameterEditor
            animation={anim}
            config={config}
            onChangeField={handleFieldChange}
            onReset={handleReset}
            onShareLink={handleShare}
          />

          {/* Interaction Guide */}
          <section className="bg-white border border-[#1b1b1f]/15 rounded-xl p-5 space-y-3">
            <h2 className="font-display text-base font-semibold text-[#1b1b1f]">
              Interaction Guide
            </h2>
            <ol className="list-decimal pl-4 space-y-1.5 text-sm text-[#5a403c]">
              {anim.interactionGuide.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* Technical Documentation Grid: Dependencies, Performance, Accessibility, Limitations */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#1b1b1f]/15">
        {/* Performance Profile & Dependencies */}
        <div className="bg-white border border-[#1b1b1f]/15 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#b52515]">
            <Cpu className="w-4.5 h-4.5" aria-hidden="true" />
            <h3 className="font-display font-semibold text-base text-[#1b1b1f]">
              Performance & Dependencies
            </h3>
          </div>
          <div className="font-mono text-xs text-[#5a403c] space-y-1 tabular-nums">
            <div>Target Frame Rate: {anim.performanceProfile.targetFps} FPS</div>
            <div>Gzipped Footprint: {anim.performanceProfile.bundleSizeKb} kB</div>
            <div>Renderer: {anim.performanceProfile.renderingEngine}</div>
          </div>
          <p className="text-xs text-[#5a403c] leading-relaxed">
            {anim.performanceProfile.complexityNote}
          </p>
          <div className="pt-2 border-t border-[#1b1b1f]/10 space-y-1">
            <span className="font-mono text-[11px] font-semibold text-[#1b1b1f] uppercase">
              Required Packages:
            </span>
            {anim.dependencies.length === 0 ? (
              <p className="font-mono text-xs text-[#006971]">
                Zero external runtime dependencies.
              </p>
            ) : (
              <ul className="space-y-1 font-mono text-xs text-[#5a403c]">
                {anim.dependencies.map((d) => (
                  <li key={d.name}>
                    <strong className="text-[#1b1b1f]">{d.name}</strong> ({d.version}) —{' '}
                    {d.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Accessibility Behavior */}
        <div className="bg-white border border-[#1b1b1f]/15 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#006971]">
            <ShieldCheck className="w-4.5 h-4.5" aria-hidden="true" />
            <h3 className="font-display font-semibold text-base text-[#1b1b1f]">
              Accessibility Behavior
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#5a403c] leading-relaxed list-disc pl-4">
            {anim.accessibilityNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
          {anim.supportedStructures && (
            <div className="pt-2 border-t border-[#1b1b1f]/10 space-y-1">
              <span className="font-mono text-[11px] font-semibold text-[#1b1b1f] uppercase">
                Supported SVG Structures:
              </span>
              <ul className="space-y-1 font-mono text-[11px] text-[#5a403c] list-disc pl-4">
                {anim.supportedStructures.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Documented Limitations & License */}
        <div className="bg-white border border-[#1b1b1f]/15 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#5d48ca]">
            <AlertTriangle className="w-4.5 h-4.5" aria-hidden="true" />
            <h3 className="font-display font-semibold text-base text-[#1b1b1f]">
              Known Limitations & Scope
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-[#5a403c] leading-relaxed list-disc pl-4">
            {anim.limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
          <div className="pt-2 border-t border-[#1b1b1f]/10 font-mono text-xs text-[#5a403c]">
            License: <strong className="text-[#1b1b1f]">{anim.license}</strong> (Free for
            commercial and open-source integration).
          </div>
        </div>
      </section>

      {/* Related Animations */}
      <section className="space-y-4 pt-4 border-t border-[#1b1b1f]/15">
        <h2 className="font-display text-xl font-semibold text-[#1b1b1f]">
          Related Lab Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedAnimations.map((rel) => (
            <button
              key={rel.id}
              type="button"
              onClick={() => onNavigate('detail', rel.id, rel.defaultConfig)}
              className="p-4 rounded-xl bg-[#f6f2f8] hover:bg-[#eae7ed] border border-[#1b1b1f]/15 text-left transition-colors space-y-1.5 cursor-pointer"
            >
              <div className="font-mono text-xs text-[#b52515]">
                {rel.indexNumber}. {rel.category}
              </div>
              <div className="font-display font-semibold text-base text-[#1b1b1f]">
                {rel.name}
              </div>
              <p className="text-xs text-[#5a403c] line-clamp-2">{rel.summary}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
