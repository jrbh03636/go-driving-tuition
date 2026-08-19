import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useReducedMotion } from "../lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/**
 * "About us" as a scroll story: a winding road draws itself across the
 * panel while a learner car travels along it, playing automatically
 * once the panel scrolls into view — no further scrolling needed to
 * see it through. Fully static (road drawn) under reduced motion.
 */

const ROAD_D =
  "M 90 830 C 420 800, 250 560, 640 520 C 980 485, 1060 420, 1130 300 C 1180 215, 1260 160, 1360 120";

const LINES = [
  { text: "No shortcuts.", cls: "left-[6%] top-[16%] md:left-[8%] md:top-[18%]" },
  { text: "No test-route tricks.", cls: "left-[6%] top-[40%] md:left-[8%] md:top-[42%] max-w-xl" },
  { text: "Just drivers who can actually drive.", cls: "right-[4%] bottom-[8%] md:right-[6%] md:bottom-[10%] max-w-xl text-right" },
];

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (reduced || !section) return;

    const ctx = gsap.context(() => {
      const road = section.querySelector<SVGPathElement>(".journey-road");
      const centre = section.querySelector<SVGPathElement>(".journey-centre");
      const car = section.querySelector<SVGGElement>(".journey-car");
      const flag = section.querySelector<SVGGElement>(".journey-flag");
      if (!road || !centre || !car || !flag) return;

      const roadLen = road.getTotalLength();
      const centreLen = centre.getTotalLength();
      gsap.set(road, { strokeDasharray: roadLen, strokeDashoffset: roadLen });
      gsap.set(centre, { strokeDasharray: "14 18", strokeDashoffset: centreLen });
      gsap.set(flag, { scale: 0, transformOrigin: "bottom center" });

      // Built paused, then played automatically once the panel scrolls
      // into view — the user doesn't need to keep scrolling to see it.
      const tl = gsap.timeline({ paused: true });

      // Road surface draws in just ahead of the car…
      tl.to(road, { strokeDashoffset: 0, duration: 1.3, ease: "none" }, 0);
      // …dashes flow along the centre line…
      tl.to(centre, { strokeDashoffset: 0, duration: 1.3, ease: "none" }, 0.05);
      // …and the learner car follows the same path.
      tl.to(
        car,
        {
          duration: 1.3,
          ease: "power1.inOut",
          motionPath: {
            path: ROAD_D,
            align: ".journey-road",
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
        },
        0.1
      );

      tl.to(flag, { scale: 1, duration: 0.4, ease: "back.out(2.5)" }, 1.3);

      ScrollTrigger.create({
        trigger: ".journey-panel",
        start: "top 75%",
        once: true,
        onEnter: () => tl.play(),
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About us"
      className="relative bg-bone-white"
    >
      {/* About copy + bonnet photo */}
      <div className="mx-auto grid min-w-0 max-w-7xl items-center gap-6 px-6 pt-12 pb-10 md:gap-12 md:pt-32 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="text-sm tracking-[0.35em] uppercase text-go-700" data-reveal>
            About us
          </p>
          <h2 className="display mt-4 text-3xl text-asphalt-950 md:text-6xl" data-reveal>
            Twenty years of first-time passes.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-asphalt-500 md:mt-8 md:text-xl" data-reveal>
            Go Driving Tuition has been teaching learners across Stockport and south Manchester for
            over 20 years. Our A-grade DVSA-approved instructors offer calm, patient one-to-one
            tuition for everyone from complete beginners to those wanting motorway lessons or
            refresher sessions, all in smart, dual-controlled, well-maintained cars. Two decades of excellent first-time pass rates, and most of our new pupils still
            come by personal recommendation.
          </p>
        </div>
        <figure data-reveal="right" className="min-w-0">
          <img
            src="/images/go-bonnet.jpg"
            alt="Close-up of the GO logo across the bonnet of a learner car, with an instructor and pupil inside"
            loading="lazy"
            className="w-full max-w-full border-4 border-asphalt-950 object-cover shadow-[12px_12px_0_#8dc63f]"
          />
        </figure>
      </div>

      <div className="journey-panel relative h-svh w-full overflow-hidden">
        {/* The road */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            className="journey-road"
            d={ROAD_D}
            fill="none"
            stroke="#0a160d"
            strokeWidth="52"
            strokeLinecap="round"
          />
          <path
            className="journey-centre"
            d={ROAD_D}
            fill="none"
            stroke="#f7f5f0"
            strokeWidth="4"
            strokeLinecap="round"
            style={reduced ? { strokeDasharray: "14 18" } : undefined}
          />

          {/* Chequered finish flag at the road's end */}
          <g className="journey-flag" transform="translate(1360 120)">
            <line x1="0" y1="6" x2="0" y2="-58" stroke="#0a160d" strokeWidth="5" strokeLinecap="round" />
            <g transform="translate(0 -58)">
              {[0, 1, 2, 3].map((c) =>
                [0, 1].map((r) => (
                  <rect
                    key={`${c}-${r}`}
                    x={c * 11}
                    y={r * 11}
                    width="11"
                    height="11"
                    fill={(c + r) % 2 === 0 ? "#0a160d" : "#f7f5f0"}
                  />
                ))
              )}
            </g>
          </g>

          {/* The learner car (drawn at the road start; motion path takes over) */}
          <g className="journey-car" transform="translate(90 830)">
            <rect x="-24" y="-13" width="48" height="26" rx="7" fill="#05100a" />
            <rect x="-10" y="-13" width="12" height="26" fill="#8dc63f" opacity="0.9" />
            <rect x="9" y="-9" width="11" height="18" rx="2" fill="#f7f5f0" />
            <text x="14.5" y="4.5" textAnchor="middle" fontSize="13" fontWeight="900" fill="#c62828" fontFamily="Arial, sans-serif">
              L
            </text>
          </g>
        </svg>

        {/* Always-visible kicker, so the panel reads as content from the
            very first frame instead of an empty page while the road/car
            and statement lines are still waiting on scroll to reveal. */}
        <p className="absolute top-[8%] left-[6%] text-sm tracking-[0.35em] text-go-700 uppercase md:left-[8%]">
          Our philosophy
        </p>

        {/* Statement lines — visible immediately, so the panel reads as
            real content from the first frame. Scrolling still plays the
            road-draw and car-travel animation underneath them. */}
        {LINES.map((line, i) => (
          <p
            key={line.text}
            className={`journey-line-${i} absolute max-w-[80vw] md:max-w-3xl ${line.cls} display text-4xl leading-tight md:text-7xl ${
              i === 1 || i === LINES.length - 1 ? "text-go-700" : "text-asphalt-950"
            }`}
          >
            {line.text}
          </p>
        ))}

      </div>
    </section>
  );
}
