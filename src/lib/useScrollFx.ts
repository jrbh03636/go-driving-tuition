import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { animate, createSpring } from "animejs";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide scroll effects, driven by the scroll wheel:
 *
 * - Lenis smooth scrolling, synced with GSAP ScrollTrigger
 * - `[data-reveal]`          → fade/slide/scale in when scrolled into view
 *                              (variants: "up" (default), "left", "right", "scale")
 * - `[data-reveal-stagger]`  → children cascade in one after another
 * - `[data-parallax]`        → element drifts at a different speed while
 *                              scrolling (value = yPercent to travel, e.g. "-15")
 * - `[data-spring]`          → anime.js spring scale on hover/press
 *
 * Everything is skipped under prefers-reduced-motion: content renders
 * static and fully visible, and native scrolling is untouched.
 */
export function useScrollFx(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!scope.current) return;

    // Smooth, inertial wheel scrolling.
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1.0 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Smooth in-page anchor navigation through Lenis.
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const target = document.querySelector(anchor.getAttribute("href")!);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -64, duration: 1.1 });
    };
    document.addEventListener("click", onAnchorClick);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const variant = el.dataset.reveal || "up";
        const from: gsap.TweenVars = { autoAlpha: 0, y: 44 };
        if (variant === "left") Object.assign(from, { x: -64, y: 0 });
        if (variant === "right") Object.assign(from, { x: 64, y: 0 });
        if (variant === "scale") Object.assign(from, { scale: 0.9, y: 24 });
        gsap.fromTo(el, from, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            // data-once: reveal a single time and never hide again
            once: el.hasAttribute("data-once"),
            toggleActions: el.hasAttribute("data-once")
              ? "play none none none"
              : "play none none reverse",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
        gsap.fromTo(
          Array.from(group.children),
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.09,
            scrollTrigger: {
              trigger: group,
              start: "top 84%",
              once: group.hasAttribute("data-once"),
              toggleActions: group.hasAttribute("data-once")
                ? "play none none none"
                : "play none none reverse",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || "-12");
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });
    }, scope);

    // 3D tilt: cards lean toward the cursor (fine pointers only).
    const tiltCleanups: Array<() => void> = [];
    if (window.matchMedia("(pointer: fine)").matches) {
      scope.current.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
        card.style.transformStyle = "preserve-3d";
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power2.out" });
        gsap.set(card, { transformPerspective: 900 });
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          rx(ny * -6);
          ry(nx * 6);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", onMove, { passive: true });
        card.addEventListener("pointerleave", onLeave);
        tiltCleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });
    }

    // anime.js springy hover/press on primary CTAs.
    const springy = Array.from(
      scope.current.querySelectorAll<HTMLElement>("[data-spring]")
    );
    const springIn = createSpring({ stiffness: 380, damping: 14 });
    const springOut = createSpring({ stiffness: 260, damping: 18 });
    const cleanups = springy.map((el) => {
      const enter = () => animate(el, { scale: 1.05, duration: 500, ease: springIn });
      const leave = () => animate(el, { scale: 1, duration: 550, ease: springOut });
      const press = () => animate(el, { scale: 0.96, duration: 250, ease: springIn });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      el.addEventListener("mousedown", press);
      el.addEventListener("mouseup", enter);
      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        el.removeEventListener("mousedown", press);
        el.removeEventListener("mouseup", enter);
      };
    });

    return () => {
      cleanups.forEach((fn) => fn());
      tiltCleanups.forEach((fn) => fn());
      document.removeEventListener("click", onAnchorClick);
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [scope]);
}
