import { useEffect, useRef } from "react";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Lightweight canvas particle field — drifting green motes with soft
 * glow, in the spirit of premium WebGL sites but cheap enough for a
 * 2D canvas. Fills its nearest positioned ancestor.
 */
interface ParticleFieldProps {
  density?: number; // particles per 10,000 px²... roughly
  className?: string;
}

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  tw: number; // twinkle phase
  green: boolean;
}

export default function ParticleField({ density = 70, className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let running = true;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 1_000_000 * density * 10);
      motes = Array.from({ length: Math.min(count, 160) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.04 - Math.random() * 0.14,
        tw: Math.random() * Math.PI * 2,
        green: Math.random() < 0.65,
      }));
    };

    const draw = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -4) m.y = h + 4;
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;
        const alpha = 0.25 + 0.3 * (0.5 + 0.5 * Math.sin(m.tw + t / 1400));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.green
          ? `rgba(141, 198, 63, ${alpha})`
          : `rgba(236, 233, 226, ${alpha * 0.7})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    // Pause when offscreen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(draw);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });

    resize();
    io.observe(canvas);
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reduced, density]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    />
  );
}
