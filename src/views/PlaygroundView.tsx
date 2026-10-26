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
  Play,
  Pause,
  Zap,
  RotateCcw,
  Maximize2,
  BookOpen,
} from 'lucide-react';

export interface PlaygroundViewProps {
  activeAnimationId: AnimationId;
  activeConfig: AnimationConfig;
  onSelectAnimation: (id: AnimationId, config?: AnimationConfig) => void;
  onUpdateConfig: (nextConfig: AnimationConfig) => void;
  onNavigate: (route: AppRoute, animId?: AnimationId) => void;
  onNotify: (msg: string) => void;
}

export default function PlaygroundView({
  activeAnimationId,
  activeConfig,
  onSelectAnimation,
  onUpdateConfig,
  onNavigate,
  onNotify,
}: PlaygroundViewProps) {
  const animation = getAnimationById(activeAnimationId);
  const allAnimations = getAllAnimations();

  const [isPlaying, setIsPlaying] = useState(true);
  const [explodeTrigger, setExplodeTrigger] = useState(0);
  const [assembleTrigger, setAssembleTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [viewportMode, setViewportMode] = useState<'390px' | '768px' | 'FULL'>('FULL');
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    rotationDeg: 42.8,
    stateLabel: 'CALIBRATED',
  });

  const handleFieldChange = (key: string, value: number | string | boolean) => {
    const validated = validateAndClampConfig(activeAnimationId, {
      ...activeConfig,
      [key]: value,
    });
    onUpdateConfig(validated);
  };

  const handleApplyPreset = (presetName: string, values: AnimationConfig) => {
    const validated = validateAndClampConfig(activeAnimationId, values);
    onUpdateConfig(validated);
    setExplodeTrigger((n) => n + 1);
    onNotify(`Applied ${presetName} preset to ${animation.name}`);
  };

  const handleResetDefaults = () => {
    onUpdateConfig(animation.defaultConfig);
    setResetTrigger((n) => n + 1);
    setScrubProgress(null);
    setIsPlaying(true);
    onNotify(`Reset ${animation.name} to default studio benchmarks`);
  };

  const handleShareUrl = async () => {
    const queryString = serializeConfigToQuery(activeAnimationId, activeConfig);
    const shareUrl = `${window.location.origin}${window.location.pathname}?${queryString}#playground`;
    window.history.replaceState(null, '', `?${queryString}#playground`);
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore clipboard errors
    }
    onNotify('Copied shareable preset URL to clipboard!');
  };

  const primaryMetricValue =
    activeAnimationId === 'paper-storm'
      ? `FRAGS: ${activeConfig.fragments}`
      : activeAnimationId === 'living-svg'
      ? `DURATION: ${activeConfig.duration}s`
      : activeAnimationId === 'gravity-garden'
      ? `PARTICLES: ${activeConfig.particleCount}`
      : activeAnimationId === 'circular-carousel'
      ? `RING: ${String(activeConfig.preset).toUpperCase()} · ${activeConfig.cardWidth}px`
      : activeAnimationId === 'hold-button'
      ? `HOLD: ${activeConfig.holdTime}ms · WAVE: ${activeConfig.waveAmplitude}px`
      : activeAnimationId === 'electric-logo'
      ? `STRANDS: ${activeConfig.strands} · GAIN: ${activeConfig.intensity}x`
      : activeAnimationId === 'tech-text'
      ? `REACH: ${activeConfig.reach}px · SIZE: ${activeConfig.fontSize}px`
      : `RADIUS: ${activeConfig.radius}px`;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Top Switcher & Preset Tray */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-[#f6f2f8] border border-[#1b1b1f]/15 p-4 rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="playground-anim-switcher"
            className="font-mono text-xs font-semibold text-[#b52515] uppercase tracking-wider"
          >
            Engine:
          </label>
          <select
            id="playground-anim-switcher"
            aria-label="Select Animation Engine"
            value={activeAnimationId}
            onChange={(e) => onSelectAnimation(e.target.value as AnimationId)}
            className="max-w-full w-full sm:w-auto truncate bg-white border border-[#1b1b1f]/20 font-display font-semibold text-sm sm:text-base text-[#1b1b1f] py-2 px-3 rounded-lg shadow-xs cursor-pointer"
          >
            {allAnimations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.indexNumber}. {item.name} ({item.subtitle})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onNavigate('detail', activeAnimationId)}
            className="px-3 py-2 rounded-lg bg-white hover:bg-[#eae7ed] border border-[#1b1b1f]/15 font-mono text-xs text-[#1b1b1f] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#006971]" aria-hidden="true" />
            <span>Engine Docs</span>
          </button>
        </div>

        {/* Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 py-0.5">
          <span className="font-mono text-xs font-semibold text-[#5a403c] uppercase tracking-wider shrink-0">
            Presets:
          </span>
          {animation.presets.map((preset) => {
            const isSelected =
              JSON.stringify(activeConfig) === JSON.stringify(preset.values);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.name, preset.values)}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer shrink-0 whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#ff5a43] text-white font-semibold border-[#1b1b1f] shadow-[2px_2px_0px_#1b1b1f]'
                    : 'bg-white hover:bg-[#eae7ed] text-[#1b1b1f] border-[#1b1b1f]/15'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 12-Column Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center Column (7 cols): Interactive Viewport Stage + Code Exporter */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Viewport Card */}
          <div className="flex flex-col bg-[#18181c] rounded-xl overflow-hidden border border-[#1b1b1f] shadow-md">
            {/* Viewport HUD Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#232329] text-[#f3f0f5] border-b border-white/10">
              <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                <span className="text-[#88f3ff] font-semibold">
                  {telemetry.fps.toFixed(1)} FPS
                </span>
                <span aria-hidden="true" className="text-white/25">|</span>
                <span className="text-[#ffb4a7]" data-testid="hud-primary-metric">
                  {primaryMetricValue}
                </span>
              </div>

              {/* Viewport Width Switcher */}
              <div
                role="group"
                aria-label="Preview Viewport Width"
                className="flex items-center gap-1 bg-white/10 rounded-md p-0.5"
              >
                {(['390px', '768px', 'FULL'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewportMode(mode)}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                      viewportMode === mode
                        ? 'bg-[#006971] text-[#88f3ff] font-semibold'
                        : 'text-[#dcd9de]/80 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Responsive Stage Container */}
            <div className="w-full bg-[#121216] flex justify-center overflow-hidden">
              <div
                className="relative h-80 sm:h-96 transition-all duration-300 border-x border-white/10"
                style={{
                  width:
                    viewportMode === '390px'
                      ? '390px'
                      : viewportMode === '768px'
                      ? '768px'
                      : '100%',
                }}
              >
                <AnimationStageRenderer
                  animationId={activeAnimationId}
                  config={activeConfig}
                  isPlaying={isPlaying}
                  explodeTrigger={explodeTrigger}
                  assembleTrigger={assembleTrigger}
                  resetTrigger={resetTrigger}
                  scrubProgress={scrubProgress}
                  onTelemetryUpdate={setTelemetry}
                  onResetConfig={handleResetDefaults}
                />

                {/* Coordinate Guides */}
                <div className="pointer-events-none absolute top-2 left-2.5 font-mono text-[10px] text-white/45">
                  [0,0,0]
                </div>
                <div className="pointer-events-none absolute top-2 right-2.5 font-mono text-[10px] text-white/45">
                  VIEWPORT: {viewportMode}
                </div>
                <div className="pointer-events-none absolute bottom-2 right-2.5 font-mono text-[10px] text-[#3ed9e9]">
                  INTERACTIVE POINTER STAGE
                </div>
              </div>
            </div>

            {/* Scrub Timeline & Mechanical Transport Bar */}
            <div className="flex flex-col bg-[#232329] p-3.5 gap-2.5 border-t border-white/10">
              <div className="flex items-center justify-between font-mono text-xs">
                <label htmlFor="timeline-scrubber" className="text-[#ffb4a7] tabular-nums">
                  {scrubProgress !== null
                    ? `SCRUB: ${(scrubProgress * 100).toFixed(0)}%`
                    : isPlaying
                    ? 'LIVE SIMULATION LOOP'
                    : 'PAUSED'}
                </label>
                <span className="text-[#dcd9de]/80 tabular-nums">
                  CYCLE: {Number(activeConfig.duration ?? 1.8).toFixed(2)}s
                </span>
              </div>

              <input
                id="timeline-scrubber"
                type="range"
                min={0}
                max={1}
                step={0.01}
                aria-label="Scrub animation cycle progress"
                value={scrubProgress ?? 0.38}
                onChange={(e) => setScrubProgress(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none accent-[#ff5a43] cursor-pointer"
              />

              {/* Transport Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScrubProgress(null);
                      setIsPlaying((p) => !p);
                    }}
                    className="h-9 px-3.5 rounded-lg bg-white text-[#1b1b1f] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-transform active:translate-y-0.5 cursor-pointer whitespace-nowrap"
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
                    onClick={() => {
                      setScrubProgress(null);
                      setExplodeTrigger((n) => n + 1);
                    }}
                    className="h-9 px-3.5 rounded-lg bg-[#ff5a43] hover:bg-[#e04832] text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-transform active:translate-y-0.5 cursor-pointer whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {activeAnimationId === 'paper-storm' ? 'Explode' : 'Trigger Impulse'}
                    </span>
                  </button>

                  {activeAnimationId === 'paper-storm' && (
                    <button
                      type="button"
                      onClick={() => {
                        setScrubProgress(null);
                        setAssembleTrigger((n) => n + 1);
                      }}
                      className="h-9 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Assemble</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  aria-label="Reset to Defaults"
                  title="Reset to Defaults"
                  className="h-9 px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Code Exporter Panel */}
          <CodeExporterPanel
            animationId={activeAnimationId}
            config={activeConfig}
            onNotify={onNotify}
          />
        </div>

        {/* Right Column (5 cols): Reusable Parameter Editor */}
        <div className="lg:col-span-5 space-y-6">
          <ParameterEditor
            animation={animation}
            config={activeConfig}
            onChangeField={handleFieldChange}
            onReset={handleResetDefaults}
            onShareLink={handleShareUrl}
          />

          {/* Interaction & Accessibility Reference Box */}
          <div className="bg-[#f6f2f8] border border-[#1b1b1f]/15 rounded-xl p-4 space-y-3">
            <h3 className="font-display font-semibold text-sm text-[#1b1b1f]">
              Interaction & Accessibility Notes
            </h3>
            <ul className="space-y-1.5 text-xs text-[#5a403c] list-disc pl-4">
              {animation.interactionGuide.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
              {animation.accessibilityNotes.map((note, idx) => (
                <li key={`acc-${idx}`} className="text-[#006971]">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
