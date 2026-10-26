import React, { useEffect, useRef } from 'react';
import { StageProps } from './PaperStormStage';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  orbitR: number;
  color: string;
}

const MODE_PALETTES: Record<string, string[]> = {
  'floating-paper': ['#ff5a43', '#ffc83b', '#fbf8fe', '#88f3ff', '#ffb4a7'],
  'magnetic-dust': ['#3ed9e9', '#88f3ff', '#ffdad4', '#c8bfff', '#ff5a43'],
  'orbiting-stars': ['#88f3ff', '#9281ff', '#ff5a43', '#ffc83b', '#ffffff'],
  'organic-trails': ['#2ecc71', '#3ed9e9', '#ffc83b', '#9281ff', '#ff5a43'],
};

export default function GravityGardenStage({
  config,
  isPlaying = true,
  explodeTrigger = 0,
  resetTrigger = 0,
}: StageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  const particleCount = Number(config.particleCount ?? 220);
  const behaviorMode = String(config.behaviorMode ?? 'floating-paper');
  const strength = Number(config.strength ?? 1.2);
  const pointerRadius = Number(config.pointerRadius ?? 160);
  const trailLength = Number(config.trailLength ?? 0.25);
  const reducedMotion = Boolean(config.reducedMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      reducedMotion ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const syncDimensions = () => {
      const w = canvas.clientWidth || 360;
      const h = canvas.clientHeight || 280;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    syncDimensions();

    const w0 = canvas.clientWidth || 360;
    const h0 = canvas.clientHeight || 280;
    const colors = MODE_PALETTES[behaviorMode] || MODE_PALETTES['floating-paper'];

    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const goldenAngle = i * 2.3999632;
      const radialNorm = Math.sqrt((i + 0.5) / particleCount);
      const orbitR = 16 + radialNorm * (Math.min(w0, h0) * 0.44);
      const startX = w0 / 2 + Math.cos(goldenAngle) * orbitR * 1.15;
      const startY = h0 / 2 + Math.sin(goldenAngle) * orbitR * 0.85;
      return {
        x: startX,
        y: startY,
        vx: Math.cos(goldenAngle + 1.2) * strength * (explodeTrigger > 0 ? 3.5 : 0.8),
        vy: Math.sin(goldenAngle + 1.2) * strength * (explodeTrigger > 0 ? 3.5 : 0.8),
        size: behaviorMode === 'floating-paper' ? 4.5 + (i % 5) : 2 + (i % 3.5),
        angle: goldenAngle,
        spin: ((i % 7) - 3) * 0.02,
        orbitR,
        color: colors[i % colors.length],
      };
    });

    // Clear initial background
    ctx.fillStyle = '#18181c';
    ctx.fillRect(0, 0, w0, h0);

    let rafId = 0;
    let tickCount = 0;

    const render = () => {
      syncDimensions();
      const w = canvas.clientWidth || 360;
      const h = canvas.clientHeight || 280;
      tickCount += 1;

      const fadeAlpha = prefersReduced ? 1 : Math.max(0.08, 1 - trailLength * 0.88);
      ctx.fillStyle = `rgba(24, 24, 28, ${fadeAlpha.toFixed(2)})`;
      ctx.fillRect(0, 0, w, h);

      const px = pointerRef.current.active ? pointerRef.current.x : w / 2;
      const py = pointerRef.current.active ? pointerRef.current.y : h / 2;

      // Subtle attractor ring visualization
      if (pointerRef.current.active && !prefersReduced) {
        ctx.strokeStyle = 'rgba(62, 217, 233, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, pointerRadius * 0.45, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isPlaying && !prefersReduced) {
          if (behaviorMode === 'orbiting-stars') {
            p.angle += 0.008 * strength * (120 / Math.max(40, p.orbitR));
            const targetX = px + Math.cos(p.angle) * p.orbitR;
            const targetY = py + Math.sin(p.angle) * (p.orbitR * 0.68);
            p.x += (targetX - p.x) * 0.08;
            p.y += (targetY - p.y) * 0.08;
          } else if (behaviorMode === 'organic-trails') {
            const fieldAngle =
              Math.sin(p.x * 0.012 + tickCount * 0.015) +
              Math.cos(p.y * 0.012 + tickCount * 0.015);
            p.vx = Math.cos(fieldAngle * Math.PI) * strength * 1.6;
            p.vy = Math.sin(fieldAngle * Math.PI) * strength * 1.6;
            p.x = (p.x + p.vx + w) % w;
            p.y = (p.y + p.vy + h) % h;
          } else {
            // floating-paper or magnetic-dust
            const dx = px - p.x;
            const dy = py - p.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 2 && dist < pointerRadius) {
              const pull = ((1 - dist / pointerRadius) * strength) / dist;
              if (behaviorMode === 'magnetic-dust') {
                p.vx += dx * pull * 0.55 - dy * pull * 0.25;
                p.vy += dy * pull * 0.55 + dx * pull * 0.25;
              } else {
                // floating paper thermal lift + gentle swirl
                p.vx -= dx * pull * 0.35;
                p.vy -= dy * pull * 0.35;
              }
            }

            if (behaviorMode === 'floating-paper') {
              p.vy -= 0.03 * strength; // gentle upward thermal float
              p.vx += Math.sin(tickCount * 0.02 + i) * 0.04;
              p.angle += p.spin * strength;
            } else {
              p.vx += Math.cos(tickCount * 0.015 + i) * 0.03 * strength;
              p.vy += Math.sin(tickCount * 0.015 + i) * 0.03 * strength;
            }

            p.vx *= 0.96;
            p.vy *= 0.96;
            p.x = (p.x + p.vx + w) % w;
            p.y = (p.y + p.vy + h) % h;
          }
        }

        ctx.fillStyle = p.color;
        if (behaviorMode === 'floating-paper') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (isPlaying && !prefersReduced) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    rafId = window.requestAnimationFrame(render);
    window.addEventListener('resize', syncDimensions);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', syncDimensions);
    };
  }, [
    particleCount,
    behaviorMode,
    strength,
    pointerRadius,
    trailLength,
    reducedMotion,
    isPlaying,
    explodeTrigger,
    resetTrigger,
  ]);

  return (
    <div
      className="relative w-full h-full bg-[#18181c] overflow-hidden select-none cursor-crosshair"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      data-testid="stage-gravity-garden"
      role="img"
      aria-label={`GravityGarden particle ecosystem running ${behaviorMode} preset`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
