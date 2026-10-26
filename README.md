# MotionForge

**An open-source laboratory and developer workbench for extraordinary web animations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-B52515.svg)](./LICENSE)
[![Demo](https://img.shields.io/badge/live-demo-FF5A43.svg)](https://vishalvc950.github.io/motionforge/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vite.dev)

**[Live Demo](https://vishalvc950.github.io/motionforge/)** · **[Gallery](https://vishalvc950.github.io/motionforge/#gallery)** · **[Playground](https://vishalvc950.github.io/motionforge/#playground)** · **[Documentation](https://vishalvc950.github.io/motionforge/#docs)**

Explore advanced motion. Customize every detail. Export standalone React, Three.js / React Three Fiber, WebGL shader, Canvas 2D, and hand-drawn SVG animations for your own applications — zero lock-in, every time.

---

## Why MotionForge?

Most animation demos are dead ends: a CodeSandbox you can tweak but never ship. MotionForge inverts that model. Every animation lives in a typed **Registry** that drives three surfaces at once — a visual **Workbench**, a **Gallery**, and a **Code Exporter** — so whatever you tune on screen becomes standalone, dependency-light source code you copy straight into your product.

- **8 production-grade engines** spanning WebGL/3D, SVG, Canvas 2D, and GLSL.
- **Live parameter workbench** — sliders, palettes, presets, timeline scrubbing, and URL-serializable share links.
- **Export as `.tsx` / `.js` / `.ts` / `.json`** — every engine ships a self-contained component with typed props and calibrated defaults baked in.
- **Validated, clamped configs** — `validateAndClampConfig()` guarantees out-of-range values can never freeze a renderer.
- **Accessibility by default** — every engine honors `prefers-reduced-motion` and cleans up deterministically on unmount.

---

## Engines (v2.4.0)

| # | Engine | Technology | Footprint | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **PaperStorm** | Three.js / React Three Fiber | `14.2 kB` | Voronoi-inspired origami facet shatter, pointer repulsion, damped spring reassembly |
| **02** | **LivingSVG** | Native SVG `pathLength` + `feTurbulence` | `3.8 kB` | Hand-drawn staggered stroke reveal, pastel crayon grain filter, cut-paper fill reveal |
| **03** | **GravityGarden** | HTML5 Canvas 2D | `4.2 kB` | Floating Paper, Magnetic Dust, Orbiting Stars, and Organic Trails particle ecosystems |
| **04** | **LiquidLens** | WebGL Fragment Shader + Canvas 2D Fallback | `5.4 kB` | Pointer-responsive UV meniscus refraction, RGB chromatic dispersion, automatic WebGL fallback |
| **05** | **CircularCarousel** | CSS 3D Transforms | `6.1 kB` | Cylindrical, orbital, wheel, and panoramic card rings with drag momentum and spring snapping |
| **06** | **HoldButton** | SVG + WAAPI | `3.4 kB` | Tactile liquid-crest press-and-hold confirmation, pointer-drift cancel, keyboard Space/Enter support |
| **07** | **ElectricLogo** | WebGL / OGL + SDF | `7.8 kB` | Signed-distance-field plasma arcs traced around arbitrary silhouettes |
| **08** | **TechText** | Canvas 2D + Spring Physics | `5.6 kB` | CAD wireframe glyph decomposition with draggable spring sprites and telemetry readouts |

---

## Quick Start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Run the unit test suite (validates registry schemas, clamping, URL preset serialization, and standalone code exports):

```bash
npx --yes tsx --test src/registry/registry.test.ts
```

Build for production:

```bash
npm run build
```

---

## Using Exported Components

Every animation in the Playground exports standalone, zero-lock-in code in **React (`.tsx`)**, **Vanilla JS (`.js`)**, **TypeScript Contract (`.ts`)**, and **JSON Preset (`.json`)** formats.

```tsx
import PaperStormScene from './PaperStormScene';
import LivingSVG from './LivingSVG';

export function HeroBanner() {
  return (
    <section>
      <PaperStormScene
        fragments={180}
        intensity={1.4}
        duration={1.8}
        palette="origami-sunset"
      />
      <LivingSVG
        duration={1.6}
        staggerDelay={0.18}
        strokeWidth={2.5}
        roughness={1.8}
      />
    </section>
  );
}
```

### Zero-Dependency Engines

`LivingSVG` (SVG + CSS/WAAPI), `GravityGarden` (HTML5 Canvas 2D), `HoldButton` (SVG + WAAPI), and `LiquidLens` (raw WebGL + Canvas 2D fallback) require **zero third-party npm packages** — drop the file in and ship.

`PaperStorm` exports both a declarative React Three Fiber component and a pure vanilla `three` module using `THREE.InstancedMesh`. `ElectricLogo` exports an OGL-based WebGL module.

---

## Architecture

The workbench is registry-driven. Adding an animation never requires touching the Parameter Editor or Code Exporter UI.

```
src/
├── registry/
│   ├── animations.ts    # Single source of truth: schemas, presets, metadata
│   ├── exporters.ts     # Standalone .tsx / .js / .ts / .json code builders
│   ├── types.ts         # Typed AnimationId, config, and export contracts
│   └── registry.test.ts # Schema, clamping, serialization & export tests
├── components/
│   ├── animations/      # One stage component per engine
│   ├── editor/          # ParameterEditor + CodeExporterPanel (auto-generated)
│   └── layout/          # Navbar + shell
└── views/               # Home, Gallery, Playground, Detail, Docs & About
```

**Config flow:** UI slider → `validateAndClampConfig(id, raw)` → stage renderer → code exporter → shareable `?anim=paper-storm&fragments=360...` URL.

---

## Performance & Accessibility Guarantees

- **Reduced Motion**: Every engine honors `prefers-reduced-motion: reduce` and the explicit `reducedMotion` prop.
- **DPR Clamping**: Canvas and WebGL renderers cap device pixel ratio at `2x` to prevent mobile GPU thermal throttling.
- **Deterministic Cleanup**: All `requestAnimationFrame` loops, event listeners, and GPU buffers are disposed on unmount.
- **Graceful WebGL Fallback**: `LiquidLens` automatically detects WebGL availability and falls back to a 2D Canvas loupe when WebGL is disabled.

---

## Contributing

We love contributions — new engines especially. The architecture is built so a contributor can register an animation without modifying any workbench UI:

1. **Register the schema & metadata** in `src/registry/animations.ts` (add the ID to `AnimationId` in `src/registry/types.ts`).
2. **Implement the stage component** in `src/components/animations/` accepting `StageProps`, with full cleanup in `useEffect` teardown and `prefers-reduced-motion` support.
3. **Add exporters** in `src/registry/exporters.ts` and verify with the test suite + `npm run build`.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide, [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community expectations, and [SECURITY.md](./SECURITY.md) for vulnerability reporting.

---

## Deploying the Demo

The live demo is served by GitHub Pages via a single workflow: on every push to `main`, Bun installs dependencies, Vite builds with a repository-relative base, and the `dist/` artifact is published automatically. No manual releases required.

---

## License

Released under the [MIT License](./LICENSE).
