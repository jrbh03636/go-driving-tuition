import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, createSpring, splitText, stagger } from "animejs";
import { useReducedMotion } from "../lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Static hero with scroll-driven depth: the GO learner car drifts and
 * scales at a different rate to the centred copy as you scroll away,
 * so the opening feels dimensional without hijacking the page. A
 * green duotone wash sits over the footage to keep the brand colour
 * present without hiding the road.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLVideoElement>(null);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const contentRef = useRef<HTMLDivElement>(null);
  const cleanupPointer = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !heroRef.current) return;
    const ctx = gsap.context(() => {
      // Car recedes and softens slightly as the page scrolls on.
      gsap.fromTo(
        imgRef.current,
        { scale: 1.08, yPercent: 0 },
        {
          scale: 1,
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );
      // Copy lifts away a touch faster for parallax separation.
      gsap.to(contentRef.current, {
        yPercent: -22,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      // Entrance: headline block rises once on load.
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 1.0, ease: "power3.out", delay: 0.15 }
      );
    }, heroRef);

    // Cursor-reactive depth: the footage shifts gently against the pointer.
    if (window.matchMedia("(pointer: fine)").matches) {
      const imgX = gsap.quickTo(imgRef.current, "x", { duration: 0.9, ease: "power3.out" });
      const imgY = gsap.quickTo(imgRef.current, "y", { duration: 0.9, ease: "power3.out" });
      const onPointer = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        imgX(nx * -18);
        imgY(ny * -12);
      };
      heroRef.current.addEventListener("pointermove", onPointer, { passive: true });
      const hero = heroRef.current;
      cleanupPointer.current = () => hero.removeEventListener("pointermove", onPointer);
    }

    // anime.js: headline letters spring in one by one.
    const h1 = heroRef.current.querySelector("h1");
    let splitter: ReturnType<typeof splitText> | undefined;
    if (h1) {
      splitter = splitText(h1, { words: false, chars: true });
      animate(splitter.chars, {
        opacity: [0, 1],
        translateY: [42, 0],
        rotate: [6, 0],
        duration: 900,
        delay: stagger(40, { start: 250 }),
        ease: createSpring({ stiffness: 210, damping: 16 }),
      });
    }

    return () => {
      cleanupPointer.current?.();
      splitter?.revert();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <header
      ref={heroRef}
      id="top-hero"
      className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-asphalt-950 md:min-h-svh"
    >
      {/* Backdrop: GO learner car tracked on the road. Reduced motion
          gets the poster still instead of the autoplaying video. */}
      {reduced ? (
        <img
          src="/videos/hero-drive-poster.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <video
          ref={imgRef}
          src={isMobile ? "/videos/hero-drive-mobile.mp4" : "/videos/hero-drive.mp4"}
          poster="/videos/hero-drive-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
        />
      )}

      {/* Green wash — kept subtle, and only present in the lower half so
          the top of the frame (behind the nav) reads as natural footage
          and the tint eases in toward the text. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(to bottom, rgba(185,225,77,0) 0%, rgba(185,225,77,0) 30%, rgba(143,201,68,0.22) 60%, rgba(111,174,44,0.4) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(141,198,63,0) 0%, rgba(141,198,63,0) 30%, rgba(141,198,63,0.08) 60%, rgba(141,198,63,0.16) 100%)",
        }}
      />

      {/* Bottom fade for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-asphalt-950/70 to-transparent" />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-12 pb-10 text-center will-change-transform md:pt-24 md:pb-20"
      >
        <h1 className="display text-5xl text-bone md:text-8xl">
          Pass at <span className="text-go-500">GO</span><span className="text-go-500">!</span>
        </h1>
        <p className="mt-6 max-w-xl text-sm font-semibold tracking-[0.15em] text-bone uppercase md:text-base">
          Learn to drive quickly, safely, economically, and pass your test first time!
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-10">
          <a
            href="#book"
            data-spring
            className="inline-flex min-h-12 items-center border border-bone/70 px-9 py-3 text-sm font-semibold tracking-widest text-bone uppercase backdrop-blur-sm transition-colors hover:bg-bone hover:text-asphalt-950"
          >
            Book now!
          </a>
          <a
            href="#pricing"
            data-spring
            className="inline-flex min-h-12 items-center border border-bone/70 px-9 py-3 text-sm font-semibold tracking-widest text-bone uppercase backdrop-blur-sm transition-colors hover:bg-bone hover:text-asphalt-950"
          >
            Check our prices
          </a>
        </div>

        <dl className="mt-8 space-y-2 md:mt-12">
          <div className="flex flex-wrap items-baseline justify-center gap-x-3">
            <dt className="display text-xl text-bone">T</dt>
            <dd>
              <a href="tel:+447988753966" className="text-lg text-bone hover:text-asphalt-950">
                07988 753 966
              </a>{" "}
              <span className="text-bone/80">or</span>{" "}
              <a href="tel:+447951238576" className="text-lg text-bone hover:text-asphalt-950">
                07951 238 576
              </a>
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-center gap-x-3">
            <dt className="display text-xl text-bone">E</dt>
            <dd>
              <a
                href="mailto:ar@go-drivingtuition.com"
                className="break-all text-lg text-bone hover:text-asphalt-950"
              >
                ar@go-drivingtuition.com
              </a>
            </dd>
          </div>
        </dl>

        {/* Social */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <a
            href="https://www.facebook.com/profile.php?id=100063522642621"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GO Driving Tuition on Facebook (opens in a new tab)"
            data-spring
            className="flex h-11 w-11 items-center justify-center border border-bone/70 text-bone transition-colors hover:bg-bone hover:text-asphalt-950"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M13.5 22v-8.5H16l.5-3.5h-3V7.7c0-1 .3-1.7 1.7-1.7H16.5V2.8C16.1 2.8 15 2.7 13.7 2.7c-2.7 0-4.5 1.6-4.5 4.6V10H6.5v3.5H9.2V22h4.3z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/go_driving_tuition/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GO Driving Tuition on Instagram (opens in a new tab)"
            data-spring
            className="flex h-11 w-11 items-center justify-center border border-bone/70 text-bone transition-colors hover:bg-bone hover:text-asphalt-950"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-bone"
      >
        <span className="text-xs tracking-[0.35em] uppercase">Scroll</span>
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none" className="animate-bounce">
          <path d="M8 2v16m0 0 6-6m-6 6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </header>
  );
}
