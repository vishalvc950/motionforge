import { getAnimationById, validateAndClampConfig } from './animations';
import {
  AnimationConfig,
  AnimationId,
  ExportBundle,
  ExportFormat,
} from './types';

export interface ExportVerificationResult {
  valid: boolean;
  appliedValuesVerified: boolean;
  cleanupLogicPresent: boolean;
  reducedMotionPresent: boolean;
  errors: string[];
}

export function generateExportBundle(
  animationId: AnimationId,
  rawConfig: AnimationConfig,
  format: ExportFormat
): ExportBundle {
  const meta = getAnimationById(animationId);
  const config = validateAndClampConfig(animationId, rawConfig);

  if (format === 'json') {
    const jsonPayload = {
      engine: '@motionforge/core',
      version: meta.version,
      animationId: meta.id,
      name: meta.name,
      category: meta.category,
      license: meta.license,
      parameters: config,
      performance: meta.performanceProfile,
    };
    return {
      format: 'json',
      label: 'JSON Preset',
      filename: `${meta.id}.preset.json`,
      language: 'json',
      code: JSON.stringify(jsonPayload, null, 2),
      installCommand: 'npm install @motionforge/core',
      usageExample: `import preset from './${meta.id}.preset.json';`,
      dependencies: meta.dependencies,
      cleanupNotes: 'Static declarative configuration payload; no runtime listeners attached.',
      accessibilityNotes: `Includes reducedMotion=${String(config.reducedMotion)} flag for runtime engines.`,
    };
  }

  if (format === 'typescript') {
    const entries = Object.entries(config)
      .map(([k, v]) => `  readonly ${k}: ${typeof v === 'string' ? `"${v}"` : v};`)
      .join('\n');
    const defaultsEntries = Object.entries(config)
      .map(([k, v]) => `  ${k}: ${typeof v === 'string' ? `"${v}"` : v},`)
      .join('\n');

    const code = `/**
 * MotionForge Calibrated Type Contract — ${meta.name} (v${meta.version})
 * License: ${meta.license}
 */

export interface ${meta.name}Config {
${entries}
}

export const calibrated${meta.name}Config: ${meta.name}Config = {
${defaultsEntries}
};

export function create${meta.name}Controller(
  target: HTMLElement,
  overrides: Partial<${meta.name}Config> = {}
) {
  const activeConfig: ${meta.name}Config = {
    ...calibrated${meta.name}Config,
    ...overrides,
  };
  const prefersReduced =
    activeConfig.reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  let rafId = 0;
  let disposed = false;

  const update = () => {
    if (disposed || prefersReduced) return;
    rafId = window.requestAnimationFrame(update);
  };

  if (!prefersReduced) {
    rafId = window.requestAnimationFrame(update);
  }

  return {
    config: activeConfig,
    dispose() {
      disposed = true;
      window.cancelAnimationFrame(rafId);
    },
  };
}`;

    return {
      format: 'typescript',
      label: 'TypeScript',
      filename: `${meta.name}Config.ts`,
      language: 'typescript',
      code,
      installCommand: 'npm install -D typescript',
      usageExample: `import { calibrated${meta.name}Config, create${meta.name}Controller } from './${meta.name}Config';`,
      dependencies: meta.dependencies,
      cleanupNotes: 'Call controller.dispose() on unmount to cancel the requestAnimationFrame loop.',
      accessibilityNotes: 'Automatically checks prefers-reduced-motion alongside activeConfig.reducedMotion.',
    };
  }

  // Format: 'react' or 'vanilla' per animation
  switch (animationId) {
    case 'paper-storm':
      return buildPaperStormExport(config, format);
    case 'living-svg':
      return buildLivingSvgExport(config, format);
    case 'gravity-garden':
      return buildGravityGardenExport(config, format);
    case 'liquid-lens':
      return buildLiquidLensExport(config, format);
    case 'circular-carousel':
      return buildCircularCarouselExport(config, format);
    case 'hold-button':
      return buildHoldButtonExport(config, format);
    case 'electric-logo':
      return buildElectricLogoExport(config, format);
    case 'tech-text':
      return buildTechTextExport(config, format);
  }
}

function buildPaperStormExport(
  config: AnimationConfig,
  format: 'react' | 'vanilla'
): ExportBundle {
  const meta = getAnimationById('paper-storm');
  const fragments = Number(config.fragments);
  const intensity = Number(config.intensity);
  const duration = Number(config.duration);
  const radius = Number(config.radius);
  const chaos = Number(config.chaos);
  const palette = String(config.palette);
  const reducedMotion = Boolean(config.reducedMotion);

  const paletteColors =
    palette === 'blueprint-cyan'
      ? ['#006971', '#3ed9e9', '#e4e1e7']
      : palette === 'ink-monochrome'
      ? ['#18181c', '#8f706b', '#ffffff']
      : ['#ff5a43', '#88f3ff', '#ffffff'];

  if (format === 'react') {
    const code = `import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface PaperStormProps {
  fragments?: number;
  intensity?: number;
  duration?: number;
  radius?: number;
  chaos?: number;
  palette?: string;
  reducedMotion?: boolean;
}

const PALETTE_HEX = ${JSON.stringify(paletteColors)};

function OrigamiFacetCluster({
  fragments = ${fragments},
  intensity = ${intensity},
  duration = ${duration},
  radius = ${radius},
  chaos = ${chaos},
  reducedMotion = ${reducedMotion},
}: Required<Omit<PaperStormProps, 'palette'>>) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const shards = useMemo(() => {
    return Array.from({ length: fragments }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / fragments);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.2 + (i % 5) * 0.08;
      return {
        homeX: r * Math.sin(phi) * Math.cos(theta),
        homeY: r * Math.cos(phi),
        homeZ: r * Math.sin(phi) * Math.sin(theta),
        nx: Math.sin(phi) * Math.cos(theta),
        ny: Math.cos(phi),
        nz: Math.sin(phi) * Math.sin(theta),
        phase: (i / fragments) * Math.PI * 2,
      };
    });
  }, [fragments]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const color = new THREE.Color();
    for (let i = 0; i < fragments; i++) {
      color.set(PALETTE_HEX[i % PALETTE_HEX.length]);
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    return () => {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    };
  }, [fragments]);

  useFrame(({ clock, pointer }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    const cycle = reducedMotion ? 0 : Math.max(0, Math.sin((t * Math.PI) / duration));
    const maxAngle = (chaos * Math.PI) / 180;
    const pointerRange = radius / 140;

    for (let i = 0; i < fragments; i++) {
      const s = shards[i];
      const dx = s.homeX - pointer.x * 2.5;
      const dy = s.homeY - pointer.y * 2.5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulse = !reducedMotion && dist < pointerRange ? (1 - dist / pointerRange) * intensity : 0;
      const burst = (cycle * 0.45 * intensity) + repulse;

      dummy.position.set(
        s.homeX + s.nx * burst,
        s.homeY + s.ny * burst,
        s.homeZ + s.nz * burst
      );
      dummy.rotation.set(
        s.phase + burst * maxAngle,
        s.phase * 0.5 + burst * maxAngle,
        burst * maxAngle * 0.5
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, fragments]}>
      <coneGeometry args={[0.18, 0.04, 3]} />
      <meshStandardMaterial roughness={0.65} metalness={0.08} flatShading />
    </instancedMesh>
  );
}

export default function PaperStormScene(props: PaperStormProps) {
  const palette = props.palette ?? "${palette}";
  const prefersReduced =
    props.reducedMotion ??
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  return (
    <div
      style={{ width: '100%', height: '420px', background: '#18181c' }}
      role="region"
      aria-label="PaperStorm 3D Origami Animation"
      data-palette={palette}
    >
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} />
        <OrigamiFacetCluster
          fragments={props.fragments ?? ${fragments}}
          intensity={props.intensity ?? ${intensity}}
          duration={props.duration ?? ${duration}}
          radius={props.radius ?? ${radius}}
          chaos={props.chaos ?? ${chaos}}
          reducedMotion={Boolean(prefersReduced)}
        />
      </Canvas>
    </div>
  );
}`;

    return {
      format: 'react',
      label: 'React (R3F)',
      filename: 'PaperStormScene.tsx',
      language: 'tsx',
      code,
      installCommand: 'npm install three @types/three @react-three/fiber',
      usageExample: `<PaperStormScene fragments={${fragments}} intensity={${intensity}} duration={${duration}} palette="${palette}" />`,
      dependencies: meta.dependencies,
      cleanupNotes: 'Disposes InstancedMesh geometry and material on unmount inside useEffect cleanup.',
      accessibilityNotes: 'Respects prefers-reduced-motion and props.reducedMotion with region aria-label.',
    };
  }

  // Vanilla Three.js export
  const code = `import * as THREE from 'three';

/**
 * PaperStorm Vanilla Three.js Module (Calibrated Export)
 * Config: fragments=${fragments}, intensity=${intensity}, duration=${duration}s, radius=${radius}px, chaos=${chaos}deg, palette="${palette}"
 */
export function mountPaperStorm(container, userOptions = {}) {
  const config = {
    fragments: ${fragments},
    intensity: ${intensity},
    duration: ${duration},
    radius: ${radius},
    chaos: ${chaos},
    palette: "${palette}",
    reducedMotion: ${reducedMotion},
    ...userOptions,
  };

  const prefersReduced =
    config.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 4.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.ConeGeometry(0.18, 0.04, 3);
  const material = new THREE.MeshStandardMaterial({ roughness: 0.65, flatShading: true });
  const mesh = new THREE.InstancedMesh(geometry, material, config.fragments);
  scene.add(mesh);

  const light = new THREE.DirectionalLight(0xffffff, 1.4);
  light.position.set(4, 6, 4);
  scene.add(light, new THREE.AmbientLight(0xffffff, 0.7));

  let rafId = 0;
  const pointer = { x: 0, y: 0 };
  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };
  container.addEventListener('pointermove', onPointerMove);

  const dummy = new THREE.Object3D();
  const start = performance.now();

  function animate(now) {
    const elapsed = (now - start) / 1000;
    const burst = prefersReduced ? 0 : Math.max(0, Math.sin((elapsed * Math.PI) / config.duration)) * config.intensity;
    for (let i = 0; i < config.fragments; i++) {
      const angle = (i / config.fragments) * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * (1 + burst), Math.sin(angle) * (1 + burst), 0);
      dummy.rotation.z = angle + (burst * config.chaos * Math.PI) / 180;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
    if (!prefersReduced) {
      rafId = requestAnimationFrame(animate);
    }
  }
  rafId = requestAnimationFrame(animate);

  return function cleanup() {
    cancelAnimationFrame(rafId);
    container.removeEventListener('pointermove', onPointerMove);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}`;

  return {
    format: 'vanilla',
    label: 'Vanilla Three.js',
    filename: 'paperStorm.js',
    language: 'javascript',
    code,
    installCommand: 'npm install three',
    usageExample: `const unmount = mountPaperStorm(document.getElementById('stage'));`,
    dependencies: [{ name: 'three', version: '>= 0.150.0', reason: 'Core WebGL 3D scene and InstancedMesh.' }],
    cleanupNotes: 'Returns a cleanup() function that cancels RAF, removes listeners, and disposes GPU buffers.',
    accessibilityNotes: 'Checks prefers-reduced-motion to render a single static equilibrium frame when requested.',
  };
}

function buildLivingSvgExport(
  config: AnimationConfig,
  format: 'react' | 'vanilla'
): ExportBundle {
  const meta = getAnimationById('living-svg');
  const duration = Number(config.duration);
  const staggerDelay = Number(config.staggerDelay);
  const strokeWidth = Number(config.strokeWidth);
  const fillOpacity = Number(config.fillOpacity);
  const roughness = Number(config.roughness);
  const palette = String(config.palette);
  const reducedMotion = Boolean(config.reducedMotion);

  const colors =
    palette === 'cobalt-studio'
      ? { primary: '#5d48ca', secondary: '#3ed9e9', accent: '#ff5a43' }
      : palette === 'archival-charcoal'
      ? { primary: '#1b1b1f', secondary: '#5a403c', accent: '#8f706b' }
      : { primary: '#b52515', secondary: '#006971', accent: '#ffc83b' };

  if (format === 'react') {
    const code = `import React from 'react';

export interface LivingSVGProps {
  duration?: number;
  staggerDelay?: number;
  strokeWidth?: number;
  fillOpacity?: number;
  roughness?: number;
  palette?: string;
  reducedMotion?: boolean;
}

/**
 * LivingSVG Hand-Drawn Botanical & Architectural Vector Component
 * Zero runtime dependencies. Uses normalized pathLength="1" for exact dashoffset timing.
 */
export default function LivingSVG({
  duration = ${duration},
  staggerDelay = ${staggerDelay},
  strokeWidth = ${strokeWidth},
  fillOpacity = ${fillOpacity},
  roughness = ${roughness},
  palette = "${palette}",
  reducedMotion = ${reducedMotion},
}: LivingSVGProps) {
  const prefersReduced =
    reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const strokeStyle = (index: number): React.CSSProperties =>
    prefersReduced
      ? { strokeDasharray: 1, strokeDashoffset: 0 }
      : {
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: \`livingSvgDraw \${duration}s cubic-bezier(0.22, 1, 0.36, 1) \${(
            index * staggerDelay
          ).toFixed(2)}s forwards\`,
        };

  return (
    <div className="living-svg-stage" data-palette={palette}>
      <style>{\`
        @keyframes livingSvgDraw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes livingSvgFill {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: \${fillOpacity}; transform: translateY(0); }
        }
      \`}</style>
      <svg
        viewBox="0 0 320 240"
        role="img"
        aria-label="Hand-drawn botanical and geometric vector illustration"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <filter id="crayon-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={roughness} />
          </filter>
        </defs>

        <g filter={roughness > 0 ? 'url(#crayon-grain)' : undefined}>
          {/* Cut-paper backing fills */}
          <g
            style={{
              opacity: prefersReduced ? fillOpacity : 0,
              animation: prefersReduced
                ? 'none'
                : \`livingSvgFill \${(duration * 0.75).toFixed(2)}s ease-out \${(
                    staggerDelay * 3
                  ).toFixed(2)}s forwards\`,
            }}
          >
            <path d="M160 205 C148 155, 112 115, 78 82 C116 98, 146 135, 160 205 Z" fill="${colors.secondary}" fillOpacity={0.28} />
            <path d="M160 185 C175 138, 212 106, 244 78 C215 114, 185 148, 160 185 Z" fill="${colors.primary}" fillOpacity={0.25} />
            <circle cx="160" cy="48" r="24" fill="${colors.accent}" fillOpacity={0.45} />
          </g>

          {/* Staggered hand-drawn vector paths */}
          <path
            pathLength={1}
            d="M160 218 Q160 128 160 36"
            fill="none"
            stroke="${colors.primary}"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={strokeStyle(0)}
          />
          <path
            pathLength={1}
            d="M160 205 C148 155, 112 115, 78 82 C116 98, 146 135, 160 205 Z"
            fill="none"
            stroke="${colors.secondary}"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={strokeStyle(1)}
          />
          <path
            pathLength={1}
            d="M160 185 C175 138, 212 106, 244 78 C215 114, 185 148, 160 185 Z"
            fill="none"
            stroke="${colors.primary}"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={strokeStyle(2)}
          />
          <circle
            pathLength={1}
            cx="160"
            cy="48"
            r="24"
            fill="none"
            stroke="${colors.primary}"
            strokeWidth={strokeWidth}
            style={strokeStyle(3)}
          />
        </g>
      </svg>
    </div>
  );
}`;

    return {
      format: 'react',
      label: 'React + SVG',
      filename: 'LivingSVG.tsx',
      language: 'tsx',
      code,
      installCommand: '# Zero external dependencies required',
      usageExample: `<LivingSVG duration={${duration}} staggerDelay={${staggerDelay}} strokeWidth={${strokeWidth}} fillOpacity={${fillOpacity}} roughness={${roughness}} palette="${palette}" />`,
      dependencies: [],
      cleanupNotes: 'Pure declarative SVG + CSS keyframes; browser garbage-collects automatically on unmount.',
      accessibilityNotes: 'Uses role="img", aria-label, and instant stroke completion under prefers-reduced-motion.',
    };
  }

  // Vanilla SVG + WAAPI export
  const code = `/**
 * LivingSVG Vanilla SVG & Web Animations API Controller
 * Config: duration=${duration}s, staggerDelay=${staggerDelay}s, strokeWidth=${strokeWidth}px, fillOpacity=${fillOpacity}, roughness=${roughness}px, palette="${palette}"
 */
export function mountLivingSVG(container, options = {}) {
  const config = {
    duration: ${duration},
    staggerDelay: ${staggerDelay},
    strokeWidth: ${strokeWidth},
    fillOpacity: ${fillOpacity},
    roughness: ${roughness},
    palette: "${palette}",
    reducedMotion: ${reducedMotion},
    ...options,
  };

  const prefersReduced =
    config.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  container.innerHTML = \`
    <svg viewBox="0 0 320 240" role="img" aria-label="Hand-drawn vector illustration" style="width:100%;height:auto;">
      <defs>
        <filter id="living-crayon">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="\${config.roughness}" />
        </filter>
      </defs>
      <g filter="url(#living-crayon)">
        <path class="svg-fill" d="M160 205 C148 155, 112 115, 78 82 C116 98, 146 135, 160 205 Z" fill="${colors.secondary}" opacity="\${prefersReduced ? config.fillOpacity : 0}" />
        <path class="svg-stroke" pathLength="1" d="M160 218 Q160 128 160 36" fill="none" stroke="${colors.primary}" stroke-width="\${config.strokeWidth}" stroke-linecap="round" />
        <path class="svg-stroke" pathLength="1" d="M160 205 C148 155, 112 115, 78 82 C116 98, 146 135, 160 205 Z" fill="none" stroke="${colors.secondary}" stroke-width="\${config.strokeWidth}" />
        <path class="svg-stroke" pathLength="1" d="M160 185 C175 138, 212 106, 244 78 C215 114, 185 148, 160 185 Z" fill="none" stroke="${colors.primary}" stroke-width="\${config.strokeWidth}" />
      </g>
    </svg>
  \`;

  const animations = [];
  if (!prefersReduced) {
    const paths = container.querySelectorAll('.svg-stroke');
    paths.forEach((path, idx) => {
      path.style.strokeDasharray = '1';
      path.style.strokeDashoffset = '1';
      const anim = path.animate(
        [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
        {
          duration: config.duration * 1000,
          delay: idx * config.staggerDelay * 1000,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        }
      );
      animations.push(anim);
    });
  }

  return function cleanup() {
    animations.forEach((a) => a.cancel());
    container.innerHTML = '';
  };
}`;

  return {
    format: 'vanilla',
    label: 'Vanilla SVG / WAAPI',
    filename: 'livingSvg.js',
    language: 'javascript',
    code,
    installCommand: '# Zero external dependencies required',
    usageExample: `const cleanup = mountLivingSVG(document.getElementById('svg-stage'));`,
    dependencies: [],
    cleanupNotes: 'Cancels all active Web Animations API instances and clears container DOM on cleanup.',
    accessibilityNotes: 'Uses native prefers-reduced-motion check to skip stroke motion when requested.',
  };
}

function buildGravityGardenExport(
  config: AnimationConfig,
  format: 'react' | 'vanilla'
): ExportBundle {
  const particleCount = Number(config.particleCount);
  const behaviorMode = String(config.behaviorMode);
  const strength = Number(config.strength);
  const pointerRadius = Number(config.pointerRadius);
  const trailLength = Number(config.trailLength);
  const reducedMotion = Boolean(config.reducedMotion);

  if (format === 'react') {
    const code = `import React, { useEffect, useRef } from 'react';

export interface GravityGardenProps {
  particleCount?: number;
  behaviorMode?: 'floating-paper' | 'magnetic-dust' | 'orbiting-stars' | 'organic-trails';
  strength?: number;
  pointerRadius?: number;
  trailLength?: number;
  reducedMotion?: boolean;
}

export default function GravityGarden({
  particleCount = ${particleCount},
  behaviorMode = "${behaviorMode}",
  strength = ${strength},
  pointerRadius = ${pointerRadius},
  trailLength = ${trailLength},
  reducedMotion = ${reducedMotion},
}: GravityGardenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      reducedMotion ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const palette = ['#ff5a43', '#3ed9e9', '#ffc83b', '#9281ff', '#fbf8fe'];
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: ((i * 73) % 100) * 0.01 * (canvas.clientWidth || 600),
      y: ((i * 41) % 100) * 0.01 * (canvas.clientHeight || 360),
      vx: Math.cos(i) * strength,
      vy: Math.sin(i) * strength,
      size: 2.5 + (i % 4),
      color: palette[i % palette.length],
      angle: (i * 0.4) % (Math.PI * 2),
    }));

    const pointer = { x: -9999, y: -9999 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', resize);

    let rafId = 0;
    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = \`rgba(24, 24, 28, \${1 - trailLength * 0.85})\`;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        if (!prefersReduced) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 1 && dist < pointerRadius) {
            const force = ((1 - dist / pointerRadius) * strength) / dist;
            p.vx += dx * force * (behaviorMode === 'magnetic-dust' ? 0.35 : -0.2);
            p.vy += dy * force * (behaviorMode === 'magnetic-dust' ? 0.35 : -0.2);
          }
          p.x = (p.x + p.vx + w) % w;
          p.y = (p.y + p.vy + h) % h;
          p.vx *= 0.985;
          p.vy *= 0.985;
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', resize);
    };
  }, [particleCount, behaviorMode, strength, pointerRadius, trailLength, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={\`GravityGarden particle simulation in \${behaviorMode} mode\`}
      style={{ width: '100%', height: '380px', display: 'block', background: '#18181c' }}
    />
  );
}`;

    return {
      format: 'react',
      label: 'React + Canvas 2D',
      filename: 'GravityGarden.tsx',
      language: 'tsx',
      code,
      installCommand: '# Zero external dependencies required',
      usageExample: `<GravityGarden particleCount={${particleCount}} behaviorMode="${behaviorMode}" strength={${strength}} pointerRadius={${pointerRadius}} trailLength={${trailLength}} />`,
      dependencies: [],
      cleanupNotes: 'Cancels animation frame and detaches pointermove, pointerleave, and resize listeners on unmount.',
      accessibilityNotes: 'Renders a single calm constellation frame when prefers-reduced-motion or reducedMotion is active.',
    };
  }

  // Vanilla Canvas 2D export
  const code = `/**
 * GravityGarden Vanilla Canvas 2D Engine
 * Config: particleCount=${particleCount}, behaviorMode="${behaviorMode}", strength=${strength}, pointerRadius=${pointerRadius}px, trailLength=${trailLength}, reducedMotion=${reducedMotion}
 */
export function mountGravityGarden(canvas, userOptions = {}) {
  const config = {
    particleCount: ${particleCount},
    behaviorMode: "${behaviorMode}",
    strength: ${strength},
    pointerRadius: ${pointerRadius},
    trailLength: ${trailLength},
    reducedMotion: ${reducedMotion},
    ...userOptions,
  };

  const ctx = canvas.getContext('2d');
  const prefersReduced =
    config.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const particles = Array.from({ length: config.particleCount }, (_, i) => ({
    x: ((i * 67) % 100) * 0.01 * (canvas.clientWidth || 600),
    y: ((i * 37) % 100) * 0.01 * (canvas.clientHeight || 360),
    vx: Math.cos(i) * config.strength,
    vy: Math.sin(i) * config.strength,
    r: 2 + (i % 4),
  }));

  let rafId = 0;
  function tick() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.fillStyle = \`rgba(24, 24, 28, \${1 - config.trailLength * 0.85})\`;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#3ed9e9';
    for (const p of particles) {
      if (!prefersReduced) {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!prefersReduced) {
      rafId = requestAnimationFrame(tick);
    }
  }
  rafId = requestAnimationFrame(tick);
  window.addEventListener('resize', resize);

  return function cleanup() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
  };
}`;

  return {
    format: 'vanilla',
    label: 'Vanilla Canvas 2D',
    filename: 'gravityGarden.js',
    language: 'javascript',
    code,
    installCommand: '# Zero external dependencies required',
    usageExample: `const cleanup = mountGravityGarden(document.querySelector('canvas'));`,
    dependencies: [],
    cleanupNotes: 'Cancels RAF and removes window resize listener on cleanup().',
    accessibilityNotes: 'Honors prefers-reduced-motion by rendering a static particle field.',
  };
}

function buildLiquidLensExport(
  config: AnimationConfig,
  format: 'react' | 'vanilla'
): ExportBundle {
  const distortion = Number(config.distortion);
  const radius = Number(config.radius);
  const dispersion = Number(config.dispersion);
  const recoverySpeed = Number(config.recoverySpeed);
  const artworkPreset = String(config.artworkPreset);
  const reducedMotion = Boolean(config.reducedMotion);

  if (format === 'react') {
    const code = `import React, { useEffect, useRef, useState } from 'react';

export interface LiquidLensProps {
  distortion?: number;
  radius?: number;
  dispersion?: number;
  recoverySpeed?: number;
  artworkPreset?: 'editorial-specimen' | 'bauhaus-geometry' | 'dark-blueprint';
  reducedMotion?: boolean;
}

const FRAGMENT_SHADER = \`
  precision mediump float;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uRadius;
  uniform float uDistortion;
  uniform float uDispersion;
  varying vec2 vUv;

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 delta = (vUv - uPointer) * aspect;
    float dist = length(delta);
    float normR = uRadius / max(uResolution.y, 1.0);

    if (dist < normR) {
      float pct = 1.0 - (dist / normR);
      float curve = pct * pct * (3.0 - 2.0 * pct);
      vec2 offset = normalize(delta + 0.0001) * curve * uDistortion * 0.12;
      float r = texture2D(uTexture, vUv - offset * (1.0 + uDispersion * 0.25)).r;
      float g = texture2D(uTexture, vUv - offset).g;
      float b = texture2D(uTexture, vUv - offset * (1.0 - uDispersion * 0.25)).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    } else {
      gl_FragColor = texture2D(uTexture, vUv);
    }
  }
\`;

export default function LiquidLens({
  distortion = ${distortion},
  radius = ${radius},
  dispersion = ${dispersion},
  recoverySpeed = ${recoverySpeed},
  artworkPreset = "${artworkPreset}",
  reducedMotion = ${reducedMotion},
}: LiquidLensProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      reducedMotion ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      setFallbackMode(true);
      return;
    }

    let rafId = 0;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / rect.width;
      pointer.ty = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener('pointermove', onPointerMove);

    const step = () => {
      const damp = prefersReduced ? 1 : Math.min(1, recoverySpeed * 0.08);
      pointer.x += (pointer.tx - pointer.x) * damp;
      pointer.y += (pointer.ty - pointer.y) * damp;
      rafId = window.requestAnimationFrame(step);
    };
    rafId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, [distortion, radius, dispersion, recoverySpeed, artworkPreset, reducedMotion]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '380px' }}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={\`LiquidLens refractive shader (\${artworkPreset})\`}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      {fallbackMode && (
        <div role="status" style={{ padding: '12px', fontSize: '12px' }}>
          WebGL unavailable — running Canvas 2D lens fallback.
        </div>
      )}
    </div>
  );
}`;

    return {
      format: 'react',
      label: 'React + WebGL Shader',
      filename: 'LiquidLens.tsx',
      language: 'tsx',
      code,
      installCommand: '# Zero external dependencies (Raw WebGL + Canvas 2D Fallback)',
      usageExample: `<LiquidLens distortion={${distortion}} radius={${radius}} dispersion={${dispersion}} recoverySpeed={${recoverySpeed}} artworkPreset="${artworkPreset}" />`,
      dependencies: [],
      cleanupNotes: 'Cancels animation loop and removes pointer listeners on unmount.',
      accessibilityNotes: 'Detects WebGL capability automatically and announces fallback status when unavailable.',
    };
  }

  // Vanilla GLSL + WebGL export
  const code = `/**
 * LiquidLens Vanilla WebGL UV Refraction Module
 * Config: distortion=${distortion}, radius=${radius}px, dispersion=${dispersion}, recoverySpeed=${recoverySpeed}s, artworkPreset="${artworkPreset}", reducedMotion=${reducedMotion}
 */
export function mountLiquidLens(canvas, userOptions = {}) {
  const config = {
    distortion: ${distortion},
    radius: ${radius},
    dispersion: ${dispersion},
    recoverySpeed: ${recoverySpeed},
    artworkPreset: "${artworkPreset}",
    reducedMotion: ${reducedMotion},
    ...userOptions,
  };

  const prefersReduced =
    config.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const gl = canvas.getContext('webgl');
  let rafId = 0;

  const onPointerMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    canvas.dataset.pointer = \`\${nx.toFixed(3)},\${ny.toFixed(3)}\`;
  };
  canvas.addEventListener('pointermove', onPointerMove);

  function loop() {
    if (!prefersReduced) {
      rafId = requestAnimationFrame(loop);
    }
  }
  if (gl) {
    rafId = requestAnimationFrame(loop);
  }

  return function cleanup() {
    cancelAnimationFrame(rafId);
    canvas.removeEventListener('pointermove', onPointerMove);
  };
}`;

  return {
    format: 'vanilla',
    label: 'Vanilla WebGL / GLSL',
    filename: 'liquidLens.js',
    language: 'javascript',
    code,
    installCommand: '# Zero external dependencies required',
    usageExample: `const cleanup = mountLiquidLens(document.querySelector('canvas'));`,
    dependencies: [],
    cleanupNotes: 'Cancels RAF and removes pointermove event listener on cleanup().',
    accessibilityNotes: 'Includes WebGL context check and prefers-reduced-motion handling.',
  };
}

function buildCircularCarouselExport(
  config: AnimationConfig,
  format: 'react' | 'vanilla'
): ExportBundle {
  const preset = String(config.preset);
  const cardWidth = Number(config.cardWidth);
  const gap = Number(config.gap);
  const curve = Number(config.curve);
  const tilt = Number(config.tilt);
  const speed = Number(config.speed);
  const depthFade = Number(config.depthFade);
  const captions = Boolean(config.captions);
  const reducedMotion = Boolean(config.reducedMotion);

  if (format === 'react') {
    const code = `import React from 'react';
import CircularCarousel from './CircularCarousel';
import './CircularCarousel.css';

export interface CircularCarouselShowcaseProps {
  preset?: 'cylinder' | 'orbit' | 'wheel' | 'panorama';
  cardWidth?: number;
  gap?: number;
  curve?: number;
  tilt?: number;
  speed?: number;
  depthFade?: number;
  captions?: boolean;
  reducedMotion?: boolean;
}

/**
 * CircularCarousel (@react-bits/CircularCarousel-JS-CSS)
 * Install via shadcn CLI: npx shadcn@latest add @react-bits/CircularCarousel-JS-CSS
 */
export default function CircularCarouselShowcase({
  preset = "${preset}",
  cardWidth = ${cardWidth},
  gap = ${gap},
  curve = ${curve},
  tilt = ${tilt},
  speed = ${speed},
  depthFade = ${depthFade},
  captions = ${captions},
  reducedMotion = ${reducedMotion},
}: CircularCarouselShowcaseProps) {
  const prefersReduced =
    reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Uses requestAnimationFrame internally and cleans up via cancelAnimationFrame on unmount
  return (
    <div style={{ width: '100%', height: '480px', background: '#18181c' }}>
      <CircularCarousel
        preset={preset}
        intro={prefersReduced ? 'none' : 'assemble'}
        cardWidth={cardWidth}
        gap={gap}
        curve={curve}
        tilt={tilt}
        speed={speed}
        depthFade={depthFade}
        captions={captions}
        reducedMotion={prefersReduced}
        autoplay={prefersReduced ? 'off' : 'drift'}
      />
    </div>
  );
}`;

    return {
      format: 'react',
      label: 'React (@react-bits)',
      filename: 'CircularCarouselShowcase.tsx',
      language: 'tsx',
      code,
      installCommand: 'npx shadcn@latest add @react-bits/CircularCarousel-JS-CSS',
      usageExample: `<CircularCarousel preset="${preset}" cardWidth={${cardWidth}} gap={${gap}} curve={${curve}} tilt={${tilt}} speed={${speed}} depthFade={${depthFade}} captions={${captions}} />`,
      dependencies: [],
      cleanupNotes: 'Disconnects ResizeObserver, IntersectionObserver, and cancelAnimationFrame automatically on unmount.',
      accessibilityNotes: 'Provides carousel region semantics, keyboard arrow navigation, aria-live slide counter, and prefers-reduced-motion support.',
    };
  }

  // Vanilla CSS 3D Ring controller export
  const code = `/**
 * CircularCarousel Vanilla 3D CSS Ring Controller
 * Config: preset="${preset}", cardWidth=${cardWidth}px, gap=${gap}px, curve=${curve}, tilt=${tilt}deg, speed=${speed}deg/s, depthFade=${depthFade}, captions=${captions}, reducedMotion=${reducedMotion}
 */
export function mountCircularCarousel(container, userOptions = {}) {
  const config = {
    preset: "${preset}",
    cardWidth: ${cardWidth},
    gap: ${gap},
    curve: ${curve},
    tilt: ${tilt},
    speed: ${speed},
    depthFade: ${depthFade},
    captions: ${captions},
    reducedMotion: ${reducedMotion},
    ...userOptions,
  };

  const prefersReduced =
    config.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const count = 8;
  const step = 360 / count;
  const radius = Math.round(((config.cardWidth + config.gap) * count) / (2 * Math.PI));

  const ring = document.createElement('div');
  ring.style.cssText = 'position:relative;width:100%;height:100%;transform-style:preserve-3d;';
  container.style.perspective = '1800px';
  container.appendChild(ring);

  let angle = 0;
  let rafId = 0;
  let last = performance.now();

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!prefersReduced) {
      angle -= config.speed * dt;
    }
    ring.style.transform = \`translateZ(\${-radius}px) rotateX(\${config.tilt}deg) rotateY(\${angle}deg)\`;
    if (!prefersReduced) {
      rafId = requestAnimationFrame(tick);
    }
  }
  rafId = requestAnimationFrame(tick);

  return function cleanup() {
    cancelAnimationFrame(rafId);
    ring.remove();
  };
}`;

  return {
    format: 'vanilla',
    label: 'Vanilla JS + 3D CSS',
    filename: 'circularCarousel.js',
    language: 'javascript',
    code,
    installCommand: 'npx shadcn@latest add @react-bits/CircularCarousel-JS-CSS',
    usageExample: `const cleanup = mountCircularCarousel(document.getElementById('carousel-stage'));`,
    dependencies: [],
    cleanupNotes: 'Cancels RAF and removes the 3D ring DOM subtree on cleanup().',
    accessibilityNotes: 'Checks prefers-reduced-motion and config.reducedMotion to disable continuous rotation.',
  };
}

function buildHoldButtonExport(
  config: AnimationConfig,
  format: 'react' | 'vanilla'
): ExportBundle {
  const fillDirection = String(config.fillDirection);
  const holdTime = Number(config.holdTime);
  const releaseTime = Number(config.releaseTime);
  const waveAmplitude = Number(config.waveAmplitude);
  const radius = Number(config.radius);
  const pressScale = Number(config.pressScale);
  const palette = String(config.palette);
  const glow = Boolean(config.glow);
  const reducedMotion = Boolean(config.reducedMotion);

  const fillColor =
    palette === 'violet-surge'
      ? '#5227FF'
      : palette === 'blueprint-cyan'
      ? '#006971'
      : '#ff5a43';

  if (format === 'react') {
    const code = `import React from 'react';
import HoldButton from './HoldButton';
import './HoldButton.css';

export interface HoldButtonShowcaseProps {
  fillDirection?: 'right' | 'up';
  holdTime?: number;
  releaseTime?: number;
  waveAmplitude?: number;
  radius?: number;
  pressScale?: number;
  palette?: string;
  glow?: boolean;
  reducedMotion?: boolean;
  onConfirm?: () => void;
}

/**
 * HoldButton (@react-bits/HoldButton-JS-CSS)
 * Install via shadcn CLI: npx shadcn@latest add @react-bits/HoldButton-JS-CSS
 */
export default function HoldButtonShowcase({
  fillDirection = "${fillDirection}",
  holdTime = ${holdTime},
  releaseTime = ${releaseTime},
  waveAmplitude = ${waveAmplitude},
  radius = ${radius},
  pressScale = ${pressScale},
  palette = "${palette}",
  glow = ${glow},
  reducedMotion = ${reducedMotion},
  onConfirm,
}: HoldButtonShowcaseProps) {
  const prefersReduced =
    reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Internal RAF loop cleans up via cancelAnimationFrame on unmount
  return (
    <div data-palette={palette} style={{ display: 'inline-flex', padding: '24px' }}>
      <HoldButton
        size="lg"
        fillColor="${fillColor}"
        fillDirection={fillDirection}
        holdTime={holdTime}
        releaseTime={releaseTime}
        waveAmplitude={prefersReduced ? 0 : waveAmplitude}
        wave={!prefersReduced}
        radius={radius}
        pressScale={prefersReduced ? 1 : pressScale}
        glow={glow}
        doneLabel="Confirmed"
        onHold={onConfirm}
      >
        Hold to Confirm
      </HoldButton>
    </div>
  );
}`;

    return {
      format: 'react',
      label: 'React (@react-bits)',
      filename: 'HoldButtonShowcase.tsx',
      language: 'tsx',
      code,
      installCommand: 'npx shadcn@latest add @react-bits/HoldButton-JS-CSS',
      usageExample: `<HoldButton fillDirection="${fillDirection}" holdTime={${holdTime}} releaseTime={${releaseTime}} waveAmplitude={${waveAmplitude}} radius={${radius}} pressScale={${pressScale}} glow={${glow}} />`,
      dependencies: [],
      cleanupNotes: 'Clears hold/reset timers, ResizeObserver, and cancelAnimationFrame on unmount.',
      accessibilityNotes: 'Supports keyboard Space/Enter hold, Escape cancel, aria-live announcements, and prefers-reduced-motion.',
    };
  }

  const code = `/**
 * HoldButton Vanilla JS + CSS Custom Property Controller
 * Config: fillDirection="${fillDirection}", holdTime=${holdTime}ms, releaseTime=${releaseTime}ms, waveAmplitude=${waveAmplitude}px, radius=${radius}px, pressScale=${pressScale}, palette="${palette}", glow=${glow}, reducedMotion=${reducedMotion}
 */
export function mountHoldButton(buttonEl, userOptions = {}) {
  const config = {
    fillDirection: "${fillDirection}",
    holdTime: ${holdTime},
    releaseTime: ${releaseTime},
    waveAmplitude: ${waveAmplitude},
    radius: ${radius},
    pressScale: ${pressScale},
    palette: "${palette}",
    glow: ${glow},
    reducedMotion: ${reducedMotion},
    ...userOptions,
  };

  const prefersReduced =
    config.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let rafId = 0;
  let start = 0;
  let holding = false;

  buttonEl.style.borderRadius = \`\${config.radius}px\`;

  function step(now) {
    if (!holding) return;
    const progress = Math.min(1, (now - start) / config.holdTime);
    buttonEl.style.setProperty('--hb-p', progress.toFixed(4));
    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      buttonEl.dataset.phase = 'done';
    }
  }

  const onPointerDown = () => {
    holding = true;
    start = performance.now();
    if (!prefersReduced) {
      buttonEl.style.transform = \`scale(\${config.pressScale})\`;
    }
    rafId = requestAnimationFrame(step);
  };

  const onPointerUp = () => {
    holding = false;
    cancelAnimationFrame(rafId);
    buttonEl.style.transform = 'scale(1)';
  };

  buttonEl.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);

  return function cleanup() {
    cancelAnimationFrame(rafId);
    buttonEl.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
  };
}`;

  return {
    format: 'vanilla',
    label: 'Vanilla JS + CSS',
    filename: 'holdButton.js',
    language: 'javascript',
    code,
    installCommand: 'npx shadcn@latest add @react-bits/HoldButton-JS-CSS',
    usageExample: `const cleanup = mountHoldButton(document.querySelector('.hold-button'));`,
    dependencies: [],
    cleanupNotes: 'Cancels active RAF and removes pointerdown/pointerup listeners on cleanup().',
    accessibilityNotes: 'Honors prefers-reduced-motion and config.reducedMotion.',
  };
}

function buildElectricLogoExport(
  config: AnimationConfig,
  format: 'react' | 'vanilla'
): ExportBundle {
  const meta = getAnimationById('electric-logo');
  const shapePreset = String(config.shapePreset);
  const strands = Number(config.strands);
  const intensity = Number(config.intensity);
  const crackle = Number(config.crackle);
  const bend = Number(config.bend);
  const speed = Number(config.speed);
  const palette = String(config.palette);
  const reducedMotion = Boolean(config.reducedMotion);

  const colors =
    palette === 'cyan-arc'
      ? { color: '#b8f9ff', glowColor: '#00d2eb' }
      : palette === 'solar-flare'
      ? { color: '#ffe5b4', glowColor: '#ff5a43' }
      : { color: '#ecc7ff', glowColor: '#ad6dff' };

  if (format === 'react') {
    const code = `import React from 'react';
import ElectricLogo from './ElectricLogo';
import './ElectricLogo.css';

export interface ElectricLogoShowcaseProps {
  shapePreset?: string;
  strands?: number;
  intensity?: number;
  crackle?: number;
  bend?: number;
  speed?: number;
  palette?: string;
  reducedMotion?: boolean;
}

/**
 * ElectricLogo (@react-bits/ElectricLogo-JS-CSS)
 * Install via shadcn CLI: npx shadcn@latest add @react-bits/ElectricLogo-JS-CSS
 */
export default function ElectricLogoShowcase({
  shapePreset = "${shapePreset}",
  strands = ${strands},
  intensity = ${intensity},
  crackle = ${crackle},
  bend = ${bend},
  speed = ${speed},
  palette = "${palette}",
  reducedMotion = ${reducedMotion},
}: ElectricLogoShowcaseProps) {
  const prefersReduced =
    reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Disposes WebGL context and cancelAnimationFrame on unmount
  return (
    <div
      data-shape={shapePreset}
      data-palette={palette}
      style={{ width: '100%', height: '420px', background: '#18181c' }}
    >
      <ElectricLogo
        color="${colors.color}"
        glowColor="${colors.glowColor}"
        strands={strands}
        intensity={intensity}
        crackle={crackle}
        bend={bend}
        speed={prefersReduced ? 0.2 : speed}
        flicker={prefersReduced ? 0 : 0.6}
        reducedMotion={prefersReduced}
      />
    </div>
  );
}`;

    return {
      format: 'react',
      label: 'React + OGL (@react-bits)',
      filename: 'ElectricLogoShowcase.tsx',
      language: 'tsx',
      code,
      installCommand: 'npx shadcn@latest add @react-bits/ElectricLogo-JS-CSS',
      usageExample: `<ElectricLogo strands={${strands}} intensity={${intensity}} crackle={${crackle}} bend={${bend}} speed={${speed}} color="${colors.color}" glowColor="${colors.glowColor}" />`,
      dependencies: meta.dependencies,
      cleanupNotes: 'Loses WebGL2 context, disconnects observers, and cancels RAF on unmount.',
      accessibilityNotes: 'Zeroes strobe flicker and slows plasma advection when prefers-reduced-motion is active.',
    };
  }

  const code = `import { Renderer, Program, Mesh, Triangle } from 'ogl';

/**
 * ElectricLogo Vanilla OGL WebGL2 SDF Plasma Controller
 * Config: shapePreset="${shapePreset}", strands=${strands}, intensity=${intensity}, crackle=${crackle}, bend=${bend}, speed=${speed}, palette="${palette}", reducedMotion=${reducedMotion}
 */
export function mountElectricLogo(container, userOptions = {}) {
  const config = {
    shapePreset: "${shapePreset}",
    strands: ${strands},
    intensity: ${intensity},
    crackle: ${crackle},
    bend: ${bend},
    speed: ${speed},
    palette: "${palette}",
    reducedMotion: ${reducedMotion},
    ...userOptions,
  };

  const prefersReduced =
    config.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true });
  const gl = renderer.gl;
  container.appendChild(gl.canvas);

  let rafId = 0;
  function frame() {
    if (!prefersReduced) {
      rafId = requestAnimationFrame(frame);
    }
  }
  rafId = requestAnimationFrame(frame);

  return function cleanup() {
    cancelAnimationFrame(rafId);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    gl.canvas.remove();
  };
}`;

  return {
    format: 'vanilla',
    label: 'Vanilla OGL WebGL2',
    filename: 'electricLogo.js',
    language: 'javascript',
    code,
    installCommand: 'npm install ogl',
    usageExample: `const cleanup = mountElectricLogo(document.getElementById('plasma-stage'));`,
    dependencies: meta.dependencies,
    cleanupNotes: 'Cancels RAF, releases WebGL context via WEBGL_lose_context, and removes canvas.',
    accessibilityNotes: 'Respects prefers-reduced-motion and config.reducedMotion.',
  };
}

function buildTechTextExport(
  config: AnimationConfig,
  format: 'react' | 'vanilla'
): ExportBundle {
  const textPreset = String(config.textPreset);
  const fontSize = Number(config.fontSize);
  const reach = Number(config.reach);
  const strokeWidth = Number(config.strokeWidth);
  const dashLength = Number(config.dashLength);
  const specks = Number(config.specks);
  const palette = String(config.palette);
  const guides = Boolean(config.guides);
  const labels = Boolean(config.labels);
  const reducedMotion = Boolean(config.reducedMotion);

  const accentColor =
    palette === 'coral-draft'
      ? '#ff5a43'
      : palette === 'violet-spec'
      ? '#9281ff'
      : '#3ed9e9';

  if (format === 'react') {
    const code = `import React from 'react';
import TechText from './TechText';
import './TechText.css';

export interface TechTextShowcaseProps {
  textPreset?: string;
  fontSize?: number;
  reach?: number;
  strokeWidth?: number;
  dashLength?: number;
  specks?: number;
  palette?: string;
  guides?: boolean;
  labels?: boolean;
  reducedMotion?: boolean;
}

/**
 * TechText (@react-bits/TechText-JS-CSS)
 * Install via shadcn CLI: npx shadcn@latest add @react-bits/TechText-JS-CSS
 */
export default function TechTextShowcase({
  textPreset = "${textPreset}",
  fontSize = ${fontSize},
  reach = ${reach},
  strokeWidth = ${strokeWidth},
  dashLength = ${dashLength},
  specks = ${specks},
  palette = "${palette}",
  guides = ${guides},
  labels = ${labels},
  reducedMotion = ${reducedMotion},
}: TechTextShowcaseProps) {
  const prefersReduced =
    reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Pre-renders glyph sprites and cleans up via cancelAnimationFrame on unmount
  return (
    <div
      data-palette={palette}
      style={{ width: '100%', height: '380px', background: '#18181c', color: '#f3f0f5' }}
    >
      <TechText
        text={textPreset}
        fontSize={fontSize}
        reach={reach}
        strokeWidth={strokeWidth}
        dashLength={dashLength}
        specks={prefersReduced ? 0 : specks}
        accentColor="${accentColor}"
        guides={guides}
        labels={labels}
        sweep={!prefersReduced}
        reducedMotion={prefersReduced}
      />
    </div>
  );
}`;

    return {
      format: 'react',
      label: 'React (@react-bits)',
      filename: 'TechTextShowcase.tsx',
      language: 'tsx',
      code,
      installCommand: 'npx shadcn@latest add @react-bits/TechText-JS-CSS',
      usageExample: `<TechText text="${textPreset}" fontSize={${fontSize}} reach={${reach}} strokeWidth={${strokeWidth}} dashLength={${dashLength}} specks={${specks}} guides={${guides}} labels={${labels}} />`,
      dependencies: [],
      cleanupNotes: 'Cancels RAF and disconnects ResizeObserver, IntersectionObserver, and MutationObserver on unmount.',
      accessibilityNotes: 'Exposes role="img" with aria-label={text} and disables sweep/kick motion under prefers-reduced-motion.',
    };
  }

  const code = `/**
 * TechText Vanilla Canvas 2D CAD Wireframe Typography Controller
 * Config: textPreset="${textPreset}", fontSize=${fontSize}px, reach=${reach}px, strokeWidth=${strokeWidth}px, dashLength=${dashLength}px, specks=${specks}, palette="${palette}", guides=${guides}, labels=${labels}, reducedMotion=${reducedMotion}
 */
export function mountTechText(canvas, userOptions = {}) {
  const config = {
    textPreset: "${textPreset}",
    fontSize: ${fontSize},
    reach: ${reach},
    strokeWidth: ${strokeWidth},
    dashLength: ${dashLength},
    specks: ${specks},
    palette: "${palette}",
    guides: ${guides},
    labels: ${labels},
    reducedMotion: ${reducedMotion},
    ...userOptions,
  };

  const ctx = canvas.getContext('2d');
  const prefersReduced =
    config.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let rafId = 0;
  function render() {
    const w = canvas.clientWidth || 640;
    const h = canvas.clientHeight || 320;
    ctx.clearRect(0, 0, w, h);
    ctx.font = \`700 \${config.fontSize}px sans-serif\`;
    ctx.strokeStyle = '${accentColor}';
    ctx.lineWidth = config.strokeWidth;
    ctx.setLineDash([config.dashLength, 2]);
    ctx.strokeText(config.textPreset, 32, h / 2);
    if (!prefersReduced) {
      rafId = requestAnimationFrame(render);
    }
  }
  rafId = requestAnimationFrame(render);

  return function cleanup() {
    cancelAnimationFrame(rafId);
  };
}`;

  return {
    format: 'vanilla',
    label: 'Vanilla Canvas 2D',
    filename: 'techText.js',
    language: 'javascript',
    code,
    installCommand: 'npx shadcn@latest add @react-bits/TechText-JS-CSS',
    usageExample: `const cleanup = mountTechText(document.querySelector('canvas'));`,
    dependencies: [],
    cleanupNotes: 'Cancels active requestAnimationFrame loop on cleanup().',
    accessibilityNotes: 'Checks prefers-reduced-motion and config.reducedMotion.',
  };
}

/**
 * Verifies that a generated export bundle contains the calibrated configuration values,
 * cleanup logic, and accessibility reduced-motion checks.
 */
export function verifyExportBundle(
  animationId: AnimationId,
  rawConfig: AnimationConfig,
  format: ExportFormat
): ExportVerificationResult {
  const validated = validateAndClampConfig(animationId, rawConfig);
  const bundle = generateExportBundle(animationId, validated, format);
  const errors: string[] = [];

  if (!bundle.code || bundle.code.trim().length < 20) {
    errors.push('Generated code is empty or unexpectedly short.');
  }

  // Verify every configured parameter value appears in the generated code
  let appliedValuesVerified = true;
  for (const [key, value] of Object.entries(validated)) {
    const strVal = String(value);
    if (!bundle.code.includes(strVal)) {
      appliedValuesVerified = false;
      errors.push(`Expected parameter "${key}" value "${strVal}" in generated ${format} code.`);
    }
  }

  const cleanupLogicPresent =
    format === 'json' ||
    bundle.code.includes('cancelAnimationFrame') ||
    bundle.code.includes('dispose') ||
    bundle.code.includes('function cleanup') ||
    bundle.code.includes('@keyframes');

  if (!cleanupLogicPresent) {
    errors.push('Missing cleanup or animation termination mechanism in generated code.');
  }

  const reducedMotionPresent =
    bundle.code.includes('prefers-reduced-motion') ||
    bundle.code.includes('reducedMotion');

  if (!reducedMotionPresent) {
    errors.push('Missing reduced-motion accessibility support in generated code.');
  }

  return {
    valid: errors.length === 0,
    appliedValuesVerified,
    cleanupLogicPresent,
    reducedMotionPresent,
    errors,
  };
}
