import { useEffect, useRef, useState } from "react";
import { animate, createSpring } from "animejs";
import gsap from "gsap";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Load-in: the real GO logo fades and springs up on a black screen,
 * then the panel wipes upward to reveal the site. Skipped entirely
 * under reduced motion.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [gone, setGone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Note: intentionally re-runnable — under StrictMode the first effect's
  // cleanup kills the tweens, and this second run restarts them.
  useEffect(() => {
    if (reduced) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    document.documentElement.style.overflow = "hidden";
    const finish = () => {
      document.documentElement.style.overflow = "";
      setGone(true);
    };

    const logo = overlay.querySelector<HTMLImageElement>(".pre-logo");
    if (!logo) return;
    animate(logo, {
      opacity: [0, 1],
      scale: [0.82, 1],
      translateY: [24, 0],
      duration: 900,
      ease: createSpring({ stiffness: 220, damping: 15 }),
    });

    const wipe = gsap.to(overlay, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
      delay: 1.7,
      onComplete: finish,
    });

    return () => {
      wipe.kill();
      document.documentElement.style.overflow = "";
    };
  }, [reduced]);

  if (reduced || gone) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
    >
      <img
        src="/images/go-logo-full.png"
        alt=""
        className="pre-logo w-64 opacity-0 md:w-80"
      />
    </div>
  );
}
