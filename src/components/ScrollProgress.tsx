import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** Thin green bar under the nav that fills as you scroll the page. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !barRef.current) return;
    const tween = gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed inset-x-0 top-16 z-50 h-0.5 origin-left scale-x-0 bg-go-500"
    />
  );
}
