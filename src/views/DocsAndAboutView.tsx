import React, { useState } from 'react';
import { AnimationId } from '../registry/types';
import { AppRoute } from '../components/layout/Navbar';
import {
  BookOpen,
  Terminal,
  Cpu,
  ShieldCheck,
  GitPullRequest,
  Wrench,
  Layers,
  Check,
  Copy,
  Sliders,
} from 'lucide-react';

export interface DocsAndAboutViewProps {
  initialTab?: 'docs' | 'about';
  onNavigate: (route: AppRoute, animId?: AnimationId) => void;
  onNotify: (msg: string) => void;
}

export default function DocsAndAboutView({
  initialTab = 'docs',
  onNavigate,
  onNotify,
}: DocsAndAboutViewProps) {
  const [activeSection, setActiveSection] = useState<string>(
    initialTab === 'about' ? 'contributing' : 'getting-started'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copySnippet = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
    setCopiedId(id);
    onNotify('Copied documentation snippet to clipboard');
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const sections = [
    { id: 'getting-started', label: '01. Getting Started & Install' },
    { id: 'react-usage', label: '02. Using the React Package' },
    { id: 'svg-canvas-3d', label: '03. SVG, Canvas 2D & 3D Guides' },
    { id: 'configuration', label: '04. Configuration & Validation' },
    { id: 'performance-a11y', label: '05. Performance & Accessibility' },
    { id: 'troubleshooting', label: '06. Troubleshooting' },
    { id: 'contributing', label: '07. About & Contributing Guide' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 bg-[#f6f2f8] border border-[#1b1b1f]/15 rounded-xl p-4 space-y-4 lg:sticky lg:top-20">
          <div className="space-y-1 border-b border-[#1b1b1f]/10 pb-3">
            <span className="font-mono text-[11px] font-semibold text-[#b52515] uppercase tracking-wider">
              MotionForge Manual
            </span>
            <h1 className="font-display text-lg font-bold text-[#1b1b1f]">
              Documentation & Open-Source Spec
            </h1>
          </div>

          <nav aria-label="Documentation Sections" className="flex flex-col gap-1">
            {sections.map((s) => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`text-left px-3 py-2 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#18181c] text-white font-semibold'
                      : 'text-[#5a403c] hover:bg-[#eae7ed] hover:text-[#1b1b1f]'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#1b1b1f]/10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onNavigate('playground', 'paper-storm')}
              className="w-full h-9 rounded-lg bg-[#ff5a43] text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Open Playground</span>
            </button>
          </div>
        </aside>

        {/* Main Documentation Content */}
        <div className="lg:col-span-9 space-y-8">
          {/* Section 1: Getting Started & Installation */}
          {activeSection === 'getting-started' && (
            <article className="bg-white border border-[#1b1b1f]/15 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-[#1b1b1f]/10 pb-4">
                <span className="font-mono text-xs text-[#b52515] uppercase">
                  01. Getting Started
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b1b1f]">
                  Installation & Supported Technologies
                </h2>
                <p className="text-sm text-[#5a403c] leading-relaxed">
                  MotionForge is an open-source animation laboratory and component library.
                  Every animation in the registry can be customized in the visual workbench
                  and exported as standalone, zero-lock-in source code.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-lg font-semibold text-[#1b1b1f]">
                  1. Install via Package Manager or Standalone Export
                </h3>
                <p className="text-sm text-[#5a403c]">
                  Install the React or core packages, or copy the self-contained component
                  file directly from the Playground exporter:
                </p>
                <div className="bg-[#18181c] text-[#f3f0f5] p-4 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
                  <code>
                    npm install three @types/three @react-three/fiber
                  </code>
                  <button
                    type="button"
                    onClick={() =>
                      copySnippet(
                        'install',
                        'npm install three @types/three @react-three/fiber'
                      )
                    }
                    className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white shrink-0 cursor-pointer"
                  >
                    {copiedId === 'install' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#f6f2f8] border border-[#1b1b1f]/10 space-y-1.5">
                  <h4 className="font-display font-semibold text-sm text-[#1b1b1f]">
                    Zero External Dependency Engines
                  </h4>
                  <p className="text-xs text-[#5a403c] leading-relaxed">
                    <strong>LivingSVG</strong> (SVG + CSS/WAAPI), <strong>GravityGarden</strong>{' '}
                    (HTML5 Canvas 2D), and <strong>LiquidLens</strong> (Raw WebGL + Canvas
                    2D fallback) require zero third-party npm packages.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#f6f2f8] border border-[#1b1b1f]/10 space-y-1.5">
                  <h4 className="font-display font-semibold text-sm text-[#1b1b1f]">
                    Three.js & R3F 3D Engines
                  </h4>
                  <p className="text-xs text-[#5a403c] leading-relaxed">
                    <strong>PaperStorm</strong> exports both a declarative React Three Fiber
                    (`@react-three/fiber`) component and a pure Vanilla `three` module using
                    `THREE.InstancedMesh`.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Section 2: Using the React Package */}
          {activeSection === 'react-usage' && (
            <article className="bg-white border border-[#1b1b1f]/15 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-[#1b1b1f]/10 pb-4">
                <span className="font-mono text-xs text-[#b52515] uppercase">
                  02. React Integration
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b1b1f]">
                  Using Exported React Components
                </h2>
                <p className="text-sm text-[#5a403c] leading-relaxed">
                  Every exported `.tsx` file from MotionForge accepts strongly typed props
                  with calibrated default values baked directly into the component signature.
                </p>
              </div>

              <pre className="bg-[#18181c] text-[#e4e1e7] p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{`import PaperStormScene from './PaperStormScene';
import LivingSVG from './LivingSVG';
import GravityGarden from './GravityGarden';
import LiquidLens from './LiquidLens';

export default function ProductLanding() {
  return (
    <main>
      {/* 1. 3D Origami Deconstruction */}
      <PaperStormScene fragments={180} intensity={1.4} duration={1.8} palette="origami-sunset" />

      {/* 2. Hand-Drawn SVG Illustration */}
      <LivingSVG duration={1.6} staggerDelay={0.18} strokeWidth={2.5} roughness={1.8} />

      {/* 3. Interactive Particle Ecosystem */}
      <GravityGarden particleCount={220} behaviorMode="floating-paper" strength={1.2} />

      {/* 4. UV Refraction Shader with Automatic Fallback */}
      <LiquidLens distortion={0.65} radius={135} dispersion={0.45} />
    </main>
  );
}`}</code>
              </pre>
            </article>
          )}

          {/* Section 3: SVG, Canvas 2D & 3D Architecture */}
          {activeSection === 'svg-canvas-3d' && (
            <article className="bg-white border border-[#1b1b1f]/15 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-[#1b1b1f]/10 pb-4">
                <span className="font-mono text-xs text-[#b52515] uppercase">
                  03. Rendering Architectures
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b1b1f]">
                  SVG, Canvas 2D, and 3D / WebGL Trade-Offs
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#f6f2f8] rounded-xl border border-[#1b1b1f]/10 space-y-2">
                  <h3 className="font-display font-semibold text-base text-[#1b1b1f]">
                    Using SVG Animations (LivingSVG)
                  </h3>
                  <p className="text-xs text-[#5a403c] leading-relaxed">
                    LivingSVG normalizes each vector stroke using <code>pathLength="1"</code>,
                    allowing uniform <code>stroke-dasharray: 1</code> and{' '}
                    <code>stroke-dashoffset</code> interpolation regardless of pixel path
                    length. Supported SVG primitives include <code>&lt;path&gt;</code>,{' '}
                    <code>&lt;circle&gt;</code>, <code>&lt;rect&gt;</code>, and{' '}
                    <code>&lt;polyline&gt;</code>. Convert <code>&lt;text&gt;</code> elements
                    to outlines before animating.
                  </p>
                </div>

                <div className="p-4 bg-[#f6f2f8] rounded-xl border border-[#1b1b1f]/10 space-y-2">
                  <h3 className="font-display font-semibold text-base text-[#1b1b1f]">
                    Using Canvas 2D Animations (GravityGarden)
                  </h3>
                  <p className="text-xs text-[#5a403c] leading-relaxed">
                    GravityGarden deliberately uses HTML5 Canvas 2D instead of WebGL for
                    particle counts between 40 and 600. Canvas 2D avoids WebGL context
                    limits on pages with multiple canvases, initializes in under 1ms, and
                    natively renders rotated cut-paper polygons and alpha-faded trails.
                  </p>
                </div>

                <div className="p-4 bg-[#f6f2f8] rounded-xl border border-[#1b1b1f]/10 space-y-2">
                  <h3 className="font-display font-semibold text-base text-[#1b1b1f]">
                    Using 3D & WebGL Shaders (PaperStorm & LiquidLens)
                  </h3>
                  <p className="text-xs text-[#5a403c] leading-relaxed">
                    PaperStorm uses coordinated spring-damper transforms on faceted triangles
                    rather than expensive per-shard rigid-body physics. LiquidLens uses a 2D
                    radial UV refraction fragment shader with RGB chromatic dispersion and
                    automatically falls back to a 2D canvas magnifier if WebGL is unavailable.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Section 4: Configuration & Validation */}
          {activeSection === 'configuration' && (
            <article className="bg-white border border-[#1b1b1f]/15 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-[#1b1b1f]/10 pb-4">
                <span className="font-mono text-xs text-[#b52515] uppercase">
                  04. Configuration & Schema Validation
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b1b1f]">
                  Validating & Sharing Presets
                </h2>
                <p className="text-sm text-[#5a403c] leading-relaxed">
                  All parameters pass through <code>validateAndClampConfig(animationId, rawConfig)</code>{' '}
                  before reaching any renderer or code generator. Out-of-bounds numbers are
                  clamped to their schema <code>[min, max]</code> range, preventing
                  accidental browser freezes from excessive particle or fragment counts.
                </p>
              </div>

              <pre className="bg-[#18181c] text-[#e4e1e7] p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{`import { validateAndClampConfig, serializeConfigToQuery } from './registry/animations';

// Safely clamps fragments to max 360 and falls back to default on invalid strings
const safeConfig = validateAndClampConfig('paper-storm', {
  fragments: 9999, // -> clamped to 360
  intensity: 1.8,
  palette: 'blueprint-cyan',
});

// Generate a shareable query string: "anim=paper-storm&fragments=360&intensity=1.8..."
const shareQuery = serializeConfigToQuery('paper-storm', safeConfig);`}</code>
              </pre>
            </article>
          )}

          {/* Section 5: Performance & Accessibility */}
          {activeSection === 'performance-a11y' && (
            <article className="bg-white border border-[#1b1b1f]/15 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-[#1b1b1f]/10 pb-4">
                <span className="font-mono text-xs text-[#b52515] uppercase">
                  05. Performance & Accessibility
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b1b1f]">
                  Reduced Motion, DPR Clamping & Cleanup
                </h2>
              </div>

              <ul className="space-y-3 text-sm text-[#5a403c] list-disc pl-5 leading-relaxed">
                <li>
                  <strong>Respect Reduced Motion:</strong> Every animation checks{' '}
                  <code>window.matchMedia('(prefers-reduced-motion: reduce)')</code> as well
                  as the explicit <code>reducedMotion</code> configuration prop.
                </li>
                <li>
                  <strong>Device Pixel Ratio Clamping:</strong> Canvas and WebGL renderers
                  clamp <code>devicePixelRatio</code> to <code>Math.min(dpr, 2)</code> to
                  prevent 9x fill-rate bottlenecks on 3x mobile Retina displays.
                </li>
                <li>
                  <strong>Deterministic Resource Cleanup:</strong> Every exported React
                  <code>useEffect</code> and Vanilla <code>cleanup()</code> function cancels
                  pending <code>requestAnimationFrame</code> IDs, removes event listeners,
                  and disposes WebGL textures/buffers.
                </li>
              </ul>
            </article>
          )}

          {/* Section 6: Troubleshooting */}
          {activeSection === 'troubleshooting' && (
            <article className="bg-white border border-[#1b1b1f]/15 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-[#1b1b1f]/10 pb-4">
                <span className="font-mono text-xs text-[#b52515] uppercase">
                  06. Troubleshooting
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b1b1f]">
                  Common Integration Questions
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#f6f2f8] rounded-lg space-y-1">
                  <h3 className="font-display font-semibold text-sm text-[#1b1b1f]">
                    Why does LiquidLens show "CANVAS 2D LENS FALLBACK" in some headless browsers?
                  </h3>
                  <p className="text-xs text-[#5a403c]">
                    When hardware WebGL is disabled or context creation is blocked, LiquidLens
                    automatically switches to its 2D Canvas radial magnification fallback so
                    users never see a blank rectangle.
                  </p>
                </div>
                <div className="p-4 bg-[#f6f2f8] rounded-lg space-y-1">
                  <h3 className="font-display font-semibold text-sm text-[#1b1b1f]">
                    My custom SVG path doesn't draw smoothly from start to end
                  </h3>
                  <p className="text-xs text-[#5a403c]">
                    Ensure your SVG <code>&lt;path&gt;</code> element includes{' '}
                    <code>pathLength="1"</code> and has an explicit <code>stroke</code> color
                    and <code>stroke-width</code> set.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* Section 7: About & Contributing */}
          {activeSection === 'contributing' && (
            <article className="bg-white border border-[#1b1b1f]/15 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-[#1b1b1f]/10 pb-4">
                <span className="font-mono text-xs text-[#b52515] uppercase">
                  07. Open-Source Governance & Contributing
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b1b1f]">
                  Contributing a New Animation to MotionForge
                </h2>
                <p className="text-sm text-[#5a403c] leading-relaxed">
                  MotionForge is released under the permissive <strong>MIT License</strong>.
                  Our architecture separates the <strong>Animation Registry</strong> from the{' '}
                  <strong>Parameter Editor</strong> and <strong>Code Exporter</strong> so
                  contributors can add a new animation without touching the workbench UI.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-lg font-semibold text-[#1b1b1f]">
                  3-Step Contributor Workflow
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-[#5a403c]">
                  <li>
                    <strong>Register Metadata & Schema:</strong> Add your animation entry and{' '}
                    <code>schema</code> fields (sliders, palettes, reducedMotion toggle) to{' '}
                    <code>src/registry/animations.ts</code>.
                  </li>
                  <li>
                    <strong>Implement Stage Component:</strong> Create a React stage component
                    in <code>src/components/animations/</code> that accepts the validated{' '}
                    <code>config</code> and cleans up all listeners on unmount.
                  </li>
                  <li>
                    <strong>Add Export Template & Unit Test:</strong> Register your standalone
                    React and Vanilla code generators in <code>src/registry/exporters.ts</code>{' '}
                    and verify with <code>npx tsx --test src/registry/registry.test.ts</code>.
                  </li>
                </ol>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
