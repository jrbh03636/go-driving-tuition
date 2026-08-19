import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** Results strip — real school figures, counting up as they scroll in. */

const RESULTS = [
  { value: 13, suffix: "", label: "Areas covered" },
  { value: 1500, suffix: "+", label: "Learners passed" },
  { value: 20, suffix: "", label: "Years on the road" },
];

export default function Results() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (reduced || !root) return;
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix ?? "";
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate() {
            el.textContent = `${Math.round(state.v).toLocaleString("en-GB")}${suffix}`;
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section aria-label="Results" className="bg-go-500 px-6 py-8 md:py-16">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-6 text-center sm:grid-cols-3 md:gap-10">
        {RESULTS.map((r) => (
          <div key={r.label}>
            <p
              className="display text-4xl text-asphalt-950 md:text-6xl"
              data-count={r.value}
              data-suffix={r.suffix}
            >
              {reduced ? `${r.value.toLocaleString("en-GB")}${r.suffix}` : `0${r.suffix}`}
            </p>
            <p className="mt-2 text-sm font-semibold tracking-[0.2em] uppercase text-asphalt-900">
              {r.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
