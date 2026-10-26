import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimationConfig } from '../../registry/types';

export interface StageProps {
  config: AnimationConfig;
  isPlaying?: boolean;
  explodeTrigger?: number;
  assembleTrigger?: number;
  resetTrigger?: number;
  scrubProgress?: number | null;
  compact?: boolean;
  onTelemetryUpdate?: (info: { fps: number; rotationDeg: number; stateLabel: string }) => void;
}

interface FacetPoly {
  id: string;
  points: [number, number][];
  cx: number;
  cy: number;
  nx: number;
  ny: number;
  nz: number;
  colorIndex: number;
  layer: 'core' | 'shard';
  baseScale: number;
}

const PALETTES: Record<string, string[]> = {
  'origami-sunset': ['#ff5a43', '#b52515', '#3ed9e9', '#5aedfd', '#fbf8fe', '#ffb4a7', '#9281ff'],
  'blueprint-cyan': ['#006971', '#3ed9e9', '#5aedfd', '#88f3ff', '#e4e1e7', '#1b1b1f', '#5d48ca'],
  'ink-monochrome': ['#2c2c34', '#464652', '#8f706b', '#dcd9de', '#fbf8fe', '#b5b2ba', '#18181c'],
};

const CORE_ORIGAMI_POLYGONS: { points: [number, number][]; colorIdx: number }[] = [
  { points: [[0, -82], [-62, 36], [0, 8]], colorIdx: 0 },
  { points: [[0, -82], [62, 36], [0, 8]], colorIdx: 1 },
  { points: [[-62, 36], [0, 8], [-32, 74]], colorIdx: 2 },
  { points: [[62, 36], [0, 8], [32, 74]], colorIdx: 3 },
  { points: [[0, 8], [-32, 74], [0, 86]], colorIdx: 4 },
  { points: [[0, 8], [32, 74], [0, 86]], colorIdx: 5 },
  { points: [[0, -82], [-28, -34], [0, -22]], colorIdx: 4 },
  { points: [[0, -82], [28, -34], [0, -22]], colorIdx: 5 },
  { points: [[-62, 36], [-28, -34], [0, 8]], colorIdx: 0 },
  { points: [[62, 36], [28, -34], [0, 8]], colorIdx: 1 },
  { points: [[-62, 36], [-82, 8], [-28, -34]], colorIdx: 6 },
  { points: [[62, 36], [82, 8], [28, -34]], colorIdx: 3 },
];

export default function PaperStormStage({
  config,
  isPlaying = true,
  explodeTrigger = 0,
  assembleTrigger = 0,
  resetTrigger = 0,
  scrubProgress = null,
  compact = false,
  onTelemetryUpdate,
}: StageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const fragments = Number(config.fragments ?? 180);
  const intensity = Number(config.intensity ?? 1.4);
  const duration = Number(config.duration ?? 1.8);
  const radius = Number(config.radius ?? 140);
  const chaos = Number(config.chaos ?? 180);
  const paletteKey = String(config.palette ?? 'origami-sunset');
  const reducedMotion = Boolean(config.reducedMotion);

  const facets = useMemo<FacetPoly[]>(() => {
    const list: FacetPoly[] = [];
    // Add core sculpted origami facets
    CORE_ORIGAMI_POLYGONS.forEach((poly, idx) => {
      const cx = poly.points.reduce((acc, p) => acc + p[0], 0) / poly.points.length;
      const cy = poly.points.reduce((acc, p) => acc + p[1], 0) / poly.points.length;
      const len = Math.hypot(cx, cy) || 1;
      list.push({
        id: `core-${idx}`,
        points: poly.points,
        cx,
        cy,
        nx: cx / len,
        ny: cy / len,
        nz: ((idx % 3) - 1) * 0.6,
        colorIndex: poly.colorIdx,
        layer: 'core',
        baseScale: 1,
      });
    });

    // Generate peripheral Voronoi-like triangular paper shards scaled to fragment count
    const shardCount = Math.max(12, Math.min(340, fragments - CORE_ORIGAMI_POLYGONS.length));
    for (let i = 0; i < shardCount; i++) {
      const goldenAngle = i * 2.3999632;
      const r = 18 + Math.sqrt(i / shardCount) * 76;
      const cx = Math.cos(goldenAngle) * r;
      const cy = Math.sin(goldenAngle) * r;
      const size = 6 + ((i * 7) % 11);
      const a1 = goldenAngle;
      const a2 = goldenAngle + 2.1;
      const a3 = goldenAngle + 4.2;
      const p1: [number, number] = [cx + Math.cos(a1) * size, cy + Math.sin(a1) * size];
      const p2: [number, number] = [cx + Math.cos(a2) * size, cy + Math.sin(a2) * size];
      const p3: [number, number] = [cx + Math.cos(a3) * size, cy + Math.sin(a3) * size];
      const len = Math.hypot(cx, cy) || 1;
      list.push({
        id: `shard-${i}`,
        points: [p1, p2, p3],
        cx,
        cy,
        nx: cx / len,
        ny: cy / len,
        nz: Math.sin(i * 1.7),
        colorIndex: i % 7,
        layer: 'shard',
        baseScale: 0.75 + (i % 4) * 0.1,
      });
    }
    return list;
  }, [fragments]);

  const impulseStateRef = useRef({
    burstEnergy: 0,
    targetBurst: 0,
    pointerX: -9999,
    pointerY: -9999,
    pointerActive: false,
    rotationY: 0,
  });

  useEffect(() => {
    if (explodeTrigger > 0) {
      impulseStateRef.current.targetBurst = 1.0;
      impulseStateRef.current.burstEnergy = 1.0;
    }
  }, [explodeTrigger]);

  useEffect(() => {
    if (assembleTrigger > 0) {
      impulseStateRef.current.targetBurst = 0.0;
      impulseStateRef.current.burstEnergy = 0.0;
    }
  }, [assembleTrigger]);

  useEffect(() => {
    if (resetTrigger > 0) {
      impulseStateRef.current.targetBurst = 0.0;
      impulseStateRef.current.burstEnergy = 0.0;
      impulseStateRef.current.rotationY = 0;
    }
  }, [resetTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      reducedMotion ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    let rafId = 0;
    let lastTime = performance.now();
    let elapsedAccumulator = 0;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 360;
      const h = canvas.clientHeight || 280;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateSize();

    const colors = PALETTES[paletteKey] || PALETTES['origami-sunset'];

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      updateSize();

      const w = canvas.clientWidth || 360;
      const h = canvas.clientHeight || 280;
      const centerX = w / 2;
      const centerY = h / 2;
      const scaleFactor = compact ? Math.min(w, h) / 235 : Math.min(w, h) / 215;

      if (isPlaying && !prefersReduced && scrubProgress === null) {
        elapsedAccumulator += dt;
        impulseStateRef.current.rotationY =
          (impulseStateRef.current.rotationY + dt * 18) % 360;
      }

      // Decay manual explode impulse smoothly
      impulseStateRef.current.burstEnergy +=
        (impulseStateRef.current.targetBurst - impulseStateRef.current.burstEnergy) *
        Math.min(1, dt * (3.2 / Math.max(0.4, duration)));
      if (impulseStateRef.current.targetBurst > 0.05) {
        impulseStateRef.current.targetBurst *= Math.pow(0.25, dt / Math.max(0.5, duration));
      }

      // Calculate harmonic cycle
      const cycleProgress =
        scrubProgress !== null
          ? scrubProgress
          : prefersReduced
          ? 0.08
          : (elapsedAccumulator % duration) / duration;

      const wave = prefersReduced
        ? 0.04
        : Math.pow(Math.sin(cycleProgress * Math.PI), 1.6) * 0.35;

      const totalBurst =
        (wave + impulseStateRef.current.burstEnergy * 0.85) * intensity;

      ctx.clearRect(0, 0, w, h);

      // Subtle studio rim glow behind origami sculpture
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.min(w, h) * 0.45
      );
      grad.addColorStop(0, `${colors[0]}26`);
      grad.addColorStop(0.6, `${colors[2]}12`);
      grad.addColorStop(1, 'rgba(24, 24, 28, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const maxRotRad = ((chaos * Math.PI) / 180) * (prefersReduced ? 0.05 : 1);
      const px = impulseStateRef.current.pointerX;
      const py = impulseStateRef.current.pointerY;

      // Draw facets back-to-front (shards then core facets)
      for (let i = facets.length - 1; i >= 0; i--) {
        const f = facets[i];
        const worldCx = centerX + f.cx * scaleFactor;
        const worldCy = centerY + f.cy * scaleFactor;

        // Pointer repulsion
        let repulseX = 0;
        let repulseY = 0;
        let localForce = 0;
        if (!prefersReduced && px > -1000) {
          const dx = worldCx - px;
          const dy = worldCy - py;
          const dist = Math.hypot(dx, dy);
          if (dist < radius && dist > 0.1) {
            localForce = Math.pow(1 - dist / radius, 1.5) * intensity;
            repulseX = (dx / dist) * localForce * 42;
            repulseY = (dy / dist) * localForce * 42;
          }
        }

        const radialSpread =
          (f.layer === 'shard' ? totalBurst * 46 : totalBurst * 28) * scaleFactor;
        const offsetX = f.nx * radialSpread + repulseX;
        const offsetY = f.ny * radialSpread + repulseY;
        const rotAngle =
          (totalBurst * 0.75 + localForce * 0.6) * maxRotRad * (i % 2 === 0 ? 1 : -1);

        // Skip drawing tiny outer shards when resting so the origami silhouette is razor-sharp
        const visibilityEnergy = totalBurst + localForce;
        if (f.layer === 'shard' && visibilityEnergy < 0.08 && i > 36) {
          continue;
        }

        ctx.save();
        ctx.translate(worldCx + offsetX, worldCy + offsetY);
        ctx.rotate(rotAngle);
        const facetScale =
          f.layer === 'shard'
            ? scaleFactor * (0.35 + Math.min(0.85, visibilityEnergy * 0.7))
            : scaleFactor;
        ctx.scale(facetScale, facetScale);

        ctx.beginPath();
        f.points.forEach(([vx, vy], pIdx) => {
          const lx = vx - f.cx;
          const ly = vy - f.cy;
          if (pIdx === 0) ctx.moveTo(lx, ly);
          else ctx.lineTo(lx, ly);
        });
        ctx.closePath();

        const baseColor = colors[f.colorIndex % colors.length];
        ctx.fillStyle = baseColor;
        ctx.globalAlpha =
          f.layer === 'shard'
            ? Math.min(0.92, 0.25 + visibilityEnergy * 0.65)
            : prefersReduced
            ? 0.92
            : 0.96;
        ctx.fill();

        // Crisp paper fold crease line
        ctx.strokeStyle = 'rgba(24, 24, 28, 0.35)';
        ctx.lineWidth = 1 / Math.max(0.5, facetScale);
        ctx.stroke();
        ctx.restore();
      }

      if (onTelemetryUpdate && Math.random() < 0.15) {
        onTelemetryUpdate({
          fps: dt > 0 ? Math.min(60, Math.round(1 / dt)) : 60,
          rotationDeg: Number(impulseStateRef.current.rotationY.toFixed(1)),
          stateLabel:
            impulseStateRef.current.burstEnergy > 0.2 ? 'DISPERSING' : 'EQUILIBRIUM',
        });
      }

      if (isPlaying && !prefersReduced) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);
    window.addEventListener('resize', updateSize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
    };
  }, [
    facets,
    intensity,
    duration,
    radius,
    chaos,
    paletteKey,
    reducedMotion,
    isPlaying,
    scrubProgress,
    compact,
    onTelemetryUpdate,
  ]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    impulseStateRef.current.pointerX = e.clientX - rect.left;
    impulseStateRef.current.pointerY = e.clientY - rect.top;
    impulseStateRef.current.pointerActive = true;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    impulseStateRef.current.pointerX = x;
    impulseStateRef.current.pointerY = y;
    impulseStateRef.current.burstEnergy = Math.min(
      1.2,
      impulseStateRef.current.burstEnergy + 0.65
    );
    impulseStateRef.current.targetBurst = 0.75;
    setRipple({ x, y, active: true });
    window.setTimeout(() => {
      setRipple((prev) => ({ ...prev, active: false }));
    }, 360);
  };

  const handlePointerLeave = () => {
    impulseStateRef.current.pointerX = -9999;
    impulseStateRef.current.pointerY = -9999;
    impulseStateRef.current.pointerActive = false;
  };

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden cursor-crosshair drafting-grid-dark bg-[#18181c]"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      data-testid="stage-paper-storm"
      role="img"
      aria-label={`PaperStorm 3D origami simulation with ${fragments} fragments`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {ripple.active && !reducedMotion && (
        <span
          className="pointer-events-none absolute w-24 h-24 rounded-full border border-[#3ed9e9]/60 bg-[#3ed9e9]/15 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 scale-125"
          style={{ left: ripple.x, top: ripple.y }}
        />
      )}
    </div>
  );
}
