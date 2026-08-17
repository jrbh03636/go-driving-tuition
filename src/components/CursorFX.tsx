import { useEffect, useRef } from "react";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Green cursor accent: a dot glued to the pointer and a trailing ring
 * that eases after it, swelling over interactive elements. Desktop
 * pointers only; the native cursor stays visible for usability.
 */
export default function CursorFX() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement;
      hovering = !!target.closest("a, button, [data-spring], input, select, textarea, label");
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      const size = hovering ? 46 : 30;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.opacity = hovering ? "0.9" : "0.45";
      ring.style.transform = `translate(${rx - size / 2}px, ${ry - size / 2}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150] hidden lg:block">
      <div ref={dotRef} className="absolute h-1.5 w-1.5 rounded-full bg-go-500" />
      <div
        ref={ringRef}
        className="absolute rounded-full border border-go-500 transition-[width,height,opacity] duration-200"
      />
    </div>
  );
}
