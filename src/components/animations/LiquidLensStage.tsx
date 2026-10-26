import React, { useEffect, useRef, useState } from 'react';
import { StageProps } from './PaperStormStage';

const VERTEX_SHADER_SRC = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    vUv.y = 1.0 - vUv.y;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uLensPos;
  uniform float uRadius;
  uniform float uDistortion;
  uniform float uDispersion;

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 delta = (vUv - uLensPos) * aspect;
    float dist = length(delta);
    float normR = uRadius / max(uResolution.y, 1.0);

    if (dist < normR) {
      float t = 1.0 - (dist / normR);
      float meniscus = t * t * (3.0 - 2.0 * t);
      vec2 dir = normalize(delta + vec2(0.0001));
      vec2 shift = dir * meniscus * uDistortion * 0.14;

      float r = texture2D(uTexture, clamp(vUv - shift * (1.0 + uDispersion * 0.35), 0.0, 1.0)).r;
      float g = texture2D(uTexture, clamp(vUv - shift, 0.0, 1.0)).g;
      float b = texture2D(uTexture, clamp(vUv - shift * (1.0 - uDispersion * 0.35), 0.0, 1.0)).b;

      // Subtle rim specular highlight
      float rim = smoothstep(normR * 0.82, normR * 0.98, dist) * (1.0 - smoothstep(normR * 0.98, normR, dist));
      vec3 col = vec3(r, g, b) + vec3(0.22, 0.75, 0.85) * rim * 0.55;
      gl_FragColor = vec4(col, 1.0);
    } else {
      gl_FragColor = texture2D(uTexture, vUv);
    }
  }
`;

function drawSpecimenCanvas(
  offscreen: HTMLCanvasElement,
  preset: string,
  width: number,
  height: number
) {
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext('2d');
  if (!ctx) return;

  if (preset === 'dark-blueprint') {
    ctx.fillStyle = '#18181c';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(62, 217, 233, 0.16)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.fillStyle = '#88f3ff';
    ctx.font = '700 54px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OPTICAL // R2.4', width / 2, height / 2 - 6);
    ctx.fillStyle = '#c8bfff';
    ctx.font = '500 14px "JetBrains Mono", monospace';
    ctx.fillText('UV REFRACTION & CHROMATIC MENISCUS', width / 2, height / 2 + 28);
  } else if (preset === 'bauhaus-geometry') {
    ctx.fillStyle = '#f9f6f0';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ff5a43';
    ctx.beginPath();
    ctx.arc(width * 0.35, height * 0.48, 62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#006971';
    ctx.fillRect(width * 0.48, height * 0.24, 110, 110);
    ctx.fillStyle = '#ffc83b';
    ctx.beginPath();
    ctx.moveTo(width * 0.26, height * 0.78);
    ctx.lineTo(width * 0.52, height * 0.32);
    ctx.lineTo(width * 0.74, height * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1b1b1f';
    ctx.font = '700 44px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BAUHAUS LENS', width / 2, height * 0.56);
  } else {
    // editorial-specimen
    ctx.fillStyle = '#f0edf2';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(27, 27, 31, 0.1)';
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(27, 27, 31, 0.16)';
    const titleSize = Math.min(64, Math.round(height * 0.26));
    ctx.font = `700 ${titleSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('FORGE', width / 2, height * 0.46);
    ctx.fillStyle = '#b52515';
    ctx.font = '600 15px "Space Grotesk", sans-serif';
    ctx.fillText('R2.4 REFRACTIVE SPECIMEN', width / 2, height * 0.62);
    ctx.fillStyle = '#5a403c';
    ctx.font = '400 11px "JetBrains Mono", monospace';
    ctx.fillText('UV Meniscus & Chromatic Dispersion', width / 2, height * 0.74);
  }
}

export default function LiquidLensStage({
  config,
  isPlaying = true,
  resetTrigger = 0,
}: StageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderMode, setRenderMode] = useState<'webgl' | 'canvas-fallback'>('webgl');

  const distortion = Number(config.distortion ?? 0.65);
  const radius = Number(config.radius ?? 135);
  const dispersion = Number(config.dispersion ?? 0.45);
  const recoverySpeed = Number(config.recoverySpeed ?? 1.4);
  const artworkPreset = String(config.artworkPreset ?? 'editorial-specimen');
  const reducedMotion = Boolean(config.reducedMotion);

  const lensPosRef = useRef({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    userInteracting: false,
  });

  useEffect(() => {
    if (resetTrigger > 0) {
      lensPosRef.current = {
        x: 0.5,
        y: 0.5,
        targetX: 0.5,
        targetY: 0.5,
        userInteracting: false,
      };
    }
  }, [resetTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      reducedMotion ||
      (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const w = Math.max(320, canvas.clientWidth || 480);
    const h = Math.max(220, canvas.clientHeight || 280);
    canvas.width = w;
    canvas.height = h;

    const offscreen = document.createElement('canvas');
    drawSpecimenCanvas(offscreen, artworkPreset, w, h);

    // Attempt WebGL shader setup first; fall back cleanly to Canvas 2D loupe if unavailable
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true });
    } catch {
      gl = null;
    }

    let rafId = 0;
    let startTime = performance.now();

    if (gl) {
      const compileShader = (type: number, src: string) => {
        const s = gl!.createShader(type);
        if (!s) return null;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
          gl!.deleteShader(s);
          return null;
        }
        return s;
      };

      const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
      const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
      const prog = gl.createProgram();

      if (vs && fs && prog) {
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          setRenderMode('webgl');
          gl.useProgram(prog);

          const buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          );

          const aPos = gl.getAttribLocation(prog, 'aPosition');
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

          const tex = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreen);

          const uRes = gl.getUniformLocation(prog, 'uResolution');
          const uLens = gl.getUniformLocation(prog, 'uLensPos');
          const uRad = gl.getUniformLocation(prog, 'uRadius');
          const uDist = gl.getUniformLocation(prog, 'uDistortion');
          const uDisp = gl.getUniformLocation(prog, 'uDispersion');

          const renderGl = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            if (!lensPosRef.current.userInteracting && isPlaying && !prefersReduced) {
              lensPosRef.current.targetX = 0.5 + Math.cos(elapsed * 1.1) * 0.18;
              lensPosRef.current.targetY = 0.5 + Math.sin(elapsed * 1.4) * 0.14;
            }
            const damp = prefersReduced ? 1 : Math.min(1, recoverySpeed * 0.08);
            lensPosRef.current.x +=
              (lensPosRef.current.targetX - lensPosRef.current.x) * damp;
            lensPosRef.current.y +=
              (lensPosRef.current.targetY - lensPosRef.current.y) * damp;

            gl!.viewport(0, 0, canvas.width, canvas.height);
            gl!.uniform2f(uRes, canvas.width, canvas.height);
            gl!.uniform2f(uLens, lensPosRef.current.x, lensPosRef.current.y);
            gl!.uniform1f(uRad, radius);
            gl!.uniform1f(uDist, distortion);
            gl!.uniform1f(uDisp, dispersion);
            gl!.drawArrays(gl!.TRIANGLES, 0, 6);

            if (isPlaying && !prefersReduced) {
              rafId = window.requestAnimationFrame(renderGl);
            }
          };

          rafId = window.requestAnimationFrame(renderGl);

          return () => {
            window.cancelAnimationFrame(rafId);
            gl?.deleteTexture(tex);
            gl?.deleteBuffer(buf);
            gl?.deleteProgram(prog);
            gl?.deleteShader(vs);
            gl?.deleteShader(fs);
          };
        }
      }
    }

    // Graceful Canvas 2D Fallback when WebGL is unavailable or disabled
    setRenderMode('canvas-fallback');
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    const renderFallback = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      if (!lensPosRef.current.userInteracting && isPlaying && !prefersReduced) {
        lensPosRef.current.targetX = 0.5 + Math.cos(elapsed * 1.1) * 0.16;
        lensPosRef.current.targetY = 0.5 + Math.sin(elapsed * 1.4) * 0.12;
      }
      const damp = prefersReduced ? 1 : Math.min(1, recoverySpeed * 0.08);
      lensPosRef.current.x +=
        (lensPosRef.current.targetX - lensPosRef.current.x) * damp;
      lensPosRef.current.y +=
        (lensPosRef.current.targetY - lensPosRef.current.y) * damp;

      ctx2d.clearRect(0, 0, w, h);
      ctx2d.drawImage(offscreen, 0, 0);

      const lx = lensPosRef.current.x * w;
      const ly = lensPosRef.current.y * h;
      const zoom = 1 + distortion * 0.45;

      ctx2d.save();
      ctx2d.beginPath();
      ctx2d.arc(lx, ly, radius * 0.65, 0, Math.PI * 2);
      ctx2d.clip();
      ctx2d.translate(lx, ly);
      ctx2d.scale(zoom, zoom);
      ctx2d.translate(-lx, -ly);
      ctx2d.drawImage(offscreen, 0, 0);
      ctx2d.restore();

      ctx2d.strokeStyle = 'rgba(0, 105, 113, 0.55)';
      ctx2d.lineWidth = 2;
      ctx2d.beginPath();
      ctx2d.arc(lx, ly, radius * 0.65, 0, Math.PI * 2);
      ctx2d.stroke();

      if (isPlaying && !prefersReduced) {
        rafId = window.requestAnimationFrame(renderFallback);
      }
    };

    rafId = window.requestAnimationFrame(renderFallback);
    return () => window.cancelAnimationFrame(rafId);
  }, [distortion, radius, dispersion, recoverySpeed, artworkPreset, reducedMotion, isPlaying]);

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none cursor-none"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        lensPosRef.current.targetX = (e.clientX - rect.left) / rect.width;
        lensPosRef.current.targetY = (e.clientY - rect.top) / rect.height;
        lensPosRef.current.userInteracting = true;
      }}
      onPointerLeave={() => {
        lensPosRef.current.userInteracting = false;
      }}
      data-testid="stage-liquid-lens"
      role="img"
      aria-label={`LiquidLens optical distortion shader (${renderMode})`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="pointer-events-none absolute bottom-2 left-3 px-2 py-0.5 rounded bg-[#18181c]/75 text-[#f3f0f5] font-mono text-[10px] tracking-wider uppercase">
        {renderMode === 'webgl' ? 'GLSL FRAGMENT SHADER ACTIVE' : 'CANVAS 2D LENS FALLBACK'}
      </div>
    </div>
  );
}
