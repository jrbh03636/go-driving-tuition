import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scrub-driven marquee: the strip slides with the scroll wheel only —
 * no constant animation. Outlined display type with green accents.
 */
export default function Marquee() {
  const stripRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !stripRef.current) return;
    const tween = gsap.fromTo(
      stripRef.current,
      { xPercent: 0 },
      {
        xPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: stripRef.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced]);

  const phrase = (
    <>
      Pass at <span className="text-go-500">GO</span>
      <span className="mx-6 text-go-500" aria-hidden="true">
        •
      </span>
    </>
  );

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-asphalt-700 bg-asphalt-950 py-6">
      <div ref={stripRef} className="flex w-max whitespace-nowrap will-change-transform">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="display px-2 text-5xl text-transparent md:text-7xl"
            style={{ WebkitTextStroke: "1.5px #ece9e2" }}
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}
