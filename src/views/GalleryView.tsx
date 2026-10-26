import React, { useMemo, useState } from 'react';
import {
  filterAnimations,
  getAvailableCategories,
} from '../registry/animations';
import {
  AnimationCategory,
  AnimationConfig,
  AnimationId,
} from '../registry/types';
import AnimationStageRenderer from '../components/animations/AnimationStageRenderer';
import { AppRoute } from '../components/layout/Navbar';
import {
  Search,
  Sliders,
  Terminal,
  RotateCcw,
  Layers,
} from 'lucide-react';

export interface GalleryViewProps {
  onNavigate: (route: AppRoute, animId?: AnimationId, presetConfig?: AnimationConfig) => void;
}

export default function GalleryView({ onNavigate }: GalleryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnimationCategory | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'index' | 'bundleSize' | 'fps'>('index');
  const [activeCardPresets, setActiveCardPresets] = useState<Record<string, AnimationConfig>>({});

  const categories = useMemo(() => getAvailableCategories(), []);

  const filteredAnimations = useMemo(
    () =>
      filterAnimations({
        category: selectedCategory,
        searchQuery,
        sortBy,
      }),
    [selectedCategory, searchQuery, sortBy]
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSortBy('index');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-10">
      {/* Header & Search Controls */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold text-[#b52515] uppercase tracking-wider">
              Animation Registry
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1b1b1f] tracking-tight">
              Art-Directed Motion Gallery
            </h1>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 font-mono text-xs text-[#5a403c]">
            <label htmlFor="gallery-sort" className="uppercase">
              Sort By:
            </label>
            <select
              id="gallery-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-[#f0edf2] border border-[#1b1b1f]/15 text-[#1b1b1f] font-mono text-xs cursor-pointer"
            >
              <option value="index">Curated Order (01–04)</option>
              <option value="bundleSize">Smallest Bundle Size</option>
              <option value="fps">Target FPS</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5a403c]">
            <Search className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <input
            type="search"
            aria-label="Search animation engines"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search art-directed animation engines by name, technology (SVG, WebGL, Canvas 2D, GLSL), or behavior..."
            className="w-full h-12 pl-11 pr-20 bg-[#f0edf2] focus:bg-white rounded-xl border border-[#1b1b1f]/15 font-sans text-sm text-[#1b1b1f] placeholder:text-[#5a403c]/70 focus:outline-2 focus:outline-[#b52515] transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 my-auto h-7 px-2 rounded bg-[#e4e1e7] text-xs font-mono text-[#1b1b1f] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Interactive Category Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div
            role="group"
            aria-label="Filter animations by category"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
          >
            {categories.map((item) => {
              const active = selectedCategory === item.category;
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => setSelectedCategory(item.category)}
                  className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                    active
                      ? 'bg-[#b52515] text-white border-[#1b1b1f] shadow-[2px_2px_0px_#1b1b1f]'
                      : 'bg-[#f0edf2] text-[#1b1b1f] border-[#1b1b1f]/15 hover:bg-[#e4e1e7]'
                  }`}
                >
                  <span>{item.category}</span>
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      active ? 'text-[#ffdad4]' : 'text-[#5a403c]'
                    }`}
                  >
                    ({item.count})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="font-mono text-xs text-[#5a403c] tabular-nums">
            Showing {filteredAnimations.length} of 4 Core Verified Engines
          </div>
        </div>
      </section>

      {/* Empty State when no search/filter matches */}
      {filteredAnimations.length === 0 ? (
        <section
          aria-live="polite"
          className="bg-white border border-[#1b1b1f]/15 rounded-xl p-10 text-center max-w-lg mx-auto my-6 space-y-4"
        >
          <p className="font-mono text-xs text-[#b52515] uppercase tracking-wider">
            Zero Matching Engines
          </p>
          <h2 className="font-display text-xl font-semibold text-[#1b1b1f]">
            No animations match "{searchQuery}"
          </h2>
          <p className="text-sm text-[#5a403c]">
            Try clearing your search filter or switching back to all registered animation
            categories.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-10 px-5 rounded-lg bg-[#ff5a43] text-white font-mono text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Filters</span>
          </button>
        </section>
      ) : (
        /* Animation Cards Grid */
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {filteredAnimations.map((anim) => {
            const activeConfig = activeCardPresets[anim.id] || anim.defaultConfig;
            return (
              <article
                key={anim.id}
                className="flex flex-col justify-between bg-white border border-[#1b1b1f]/20 rounded-xl shadow-sm overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 bg-[#f6f2f8] border-b border-[#1b1b1f]/10">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-lg font-semibold text-[#1b1b1f] truncate">
                          {anim.indexNumber}. {anim.name}
                        </h2>
                        <span className="font-mono text-[11px] text-[#b52515] font-semibold uppercase">
                          · {anim.badge}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[#5a403c] mt-0.5">
                        {anim.tags.join(' · ')}
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs text-[#006971] shrink-0 tabular-nums">
                      <div>{anim.performanceProfile.targetFps} FPS</div>
                      <div className="text-[11px] text-[#5a403c]">
                        {anim.performanceProfile.bundleSizeKb} kB
                      </div>
                    </div>
                  </div>

                  {/* Live Stage Preview */}
                  <div className="relative w-full h-60 border-b border-[#1b1b1f]/10">
                    <AnimationStageRenderer
                      animationId={anim.id}
                      config={activeConfig}
                      isPlaying={true}
                    />
                  </div>

                  {/* Interactive Preset Switcher & Description */}
                  <div className="p-5 space-y-4">
                    {/* Preset Selector Buttons */}
                    <div className="flex items-center gap-1.5 p-1 bg-[#f0edf2] rounded-lg overflow-x-auto no-scrollbar">
                      {anim.presets.map((preset) => {
                        const isPresetSelected =
                          JSON.stringify(activeConfig) === JSON.stringify(preset.values);
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() =>
                              setActiveCardPresets((prev) => ({
                                ...prev,
                                [anim.id]: preset.values,
                              }))
                            }
                            className={`flex-1 py-1.5 px-2.5 rounded font-mono text-[11px] transition-colors cursor-pointer whitespace-nowrap ${
                              isPresetSelected
                                ? 'bg-white text-[#1b1b1f] font-semibold shadow-xs'
                                : 'text-[#5a403c] hover:text-[#1b1b1f]'
                            }`}
                          >
                            {preset.name}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-sm text-[#5a403c] leading-relaxed">
                      {anim.summary}
                    </p>

                    {/* Unboxed Metadata Line */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#5a403c] pt-1 border-t border-[#1b1b1f]/10">
                      <span className="text-[#1b1b1f] font-semibold">Exports:</span>
                      <span>React</span>
                      <span aria-hidden="true">·</span>
                      <span>Vanilla JS</span>
                      <span aria-hidden="true">·</span>
                      <span>TypeScript</span>
                      <span aria-hidden="true">·</span>
                      <span>JSON Preset</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 pb-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('playground', anim.id, activeConfig)}
                    className="flex-1 h-11 bg-[#b52515] hover:bg-[#920600] text-white rounded-xl flex items-center justify-center gap-2 font-display font-semibold text-sm shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sliders className="w-4 h-4" aria-hidden="true" />
                    <span>Open Playground</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('detail', anim.id, activeConfig)}
                    className="h-11 px-4 bg-[#f0edf2] hover:bg-[#e4e1e7] text-[#1b1b1f] border border-[#1b1b1f]/15 rounded-xl flex items-center justify-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Terminal className="w-4 h-4" aria-hidden="true" />
                    <span>Inspect</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Runtime Export Matrix Reference */}
      <section className="p-6 bg-[#f6f2f8] border border-[#1b1b1f]/15 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-[#b52515]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-[#1b1b1f]">
              Runtime Export Matrix
            </h2>
          </div>
          <span className="font-mono text-xs text-[#5a403c] uppercase">
            Verified Pipeline Trade-offs
          </span>
        </div>

        <p className="text-sm text-[#5a403c]">
          Every MotionForge engine guarantees copy-paste standalone code. Review pipeline
          trade-offs before choosing your target integration format:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-[#1b1b1f]/10 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <strong className="font-display text-sm text-[#1b1b1f]">
                React Three Fiber / WebGL
              </strong>
              <span className="text-[#b52515] font-semibold">3D & SHADERS</span>
            </div>
            <div className="text-xs font-mono text-[#5a403c] tabular-nums">
              Payload: ~5.4–14.2 kB · Draw latency: &lt; 2.1ms · Automatic Canvas 2D Fallback
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-[#1b1b1f]/10 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <strong className="font-display text-sm text-[#1b1b1f]">
                Pure SVG & WAAPI Keyframes
              </strong>
              <span className="text-[#006971] font-semibold">ZERO BUNDLE</span>
            </div>
            <div className="text-xs font-mono text-[#5a403c] tabular-nums">
              Payload: 3.8 kB · Compositor Accelerated · Zero External Dependencies
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-[#1b1b1f]/10 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <strong className="font-display text-sm text-[#1b1b1f]">
                Vanilla Canvas 2D
              </strong>
              <span className="text-[#5d48ca] font-semibold">PARTICLE SCALE</span>
            </div>
            <div className="text-xs font-mono text-[#5a403c] tabular-nums">
              Payload: 4.2 kB · DPR Clamped (max 2x) · Deterministic Unmount Cleanup
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
