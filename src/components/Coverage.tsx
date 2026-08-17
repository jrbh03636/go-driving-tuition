import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, createSpring, stagger, svg as animeSvg } from "animejs";
import { useReducedMotion } from "../lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Approximate visual coverage map, centred on Stockport and extending
 * into Manchester. Deliberately stylised — not a geographic survey.
 * When scrolled into view, the roads and coverage outline draw
 * themselves in (anime.js drawables) and the area markers spring on.
 */

interface Area {
  name: string;
  x: number;
  y: number;
  major?: boolean;
}

const AREAS: Area[] = [
  { name: "Stockport", x: 480, y: 155, major: true },
  { name: "Hazel Grove", x: 620, y: 230 },
  { name: "Cheadle", x: 300, y: 255 },
  { name: "Bramhall", x: 430, y: 335 },
  { name: "Woodford", x: 462, y: 442 },
  { name: "Poynton", x: 600, y: 470 },
  { name: "Wilmslow", x: 300, y: 485 },
];

const ZONE_DASH = "10 8";

export default function Coverage() {
  const figureRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const figure = figureRef.current;
    if (reduced || !figure) return;

    const zone = figure.querySelector<SVGPathElement>(".map-zone");
    const dots = Array.from(figure.querySelectorAll<SVGCircleElement>(".map-dot"));
    const labels = Array.from(figure.querySelectorAll<SVGTextElement>(".map-label"));

    // Hidden until the draw-in plays.
    gsap.set(dots, { scale: 0, transformOrigin: "center", svgOrigin: undefined });
    gsap.set(labels, { opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: figure,
      start: "top 75%",
      once: true,
      onEnter() {
        // Roads + coverage outline draw themselves in.
        const drawables = animeSvg.createDrawable(".map-road, .map-zone");
        animate(drawables, {
          draw: ["0 0", "0 1"],
          duration: 1500,
          delay: stagger(140),
          ease: "inOutQuad",
          onComplete() {
            // Restore the dashed styling the drawable overrode.
            zone?.setAttribute("stroke-dasharray", ZONE_DASH);
          },
        });
        // Area markers pop on with a spring, labels follow.
        animate(dots, {
          scale: [0, 1],
          duration: 700,
          delay: stagger(70, { start: 500 }),
          ease: createSpring({ stiffness: 300, damping: 13 }),
        });
        animate(labels, {
          opacity: [0, 1],
          duration: 450,
          delay: stagger(70, { start: 650 }),
          ease: "outQuad",
        });
      },
    });

    return () => trigger.kill();
  }, [reduced]);

  return (
    <section id="coverage" aria-label="Location and coverage" className="bg-asphalt-900 px-6 py-24 md:py-36">
      <div className="mx-auto grid min-w-0 max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div data-reveal="left" className="min-w-0">
          <p className="text-sm tracking-[0.35em] uppercase text-go-500">Where we teach</p>
          <h2 className="display mt-4 text-4xl text-bone md:text-6xl">
            Stockport &amp; South Manchester.
          </h2>
          <p className="mt-8 leading-relaxed text-bone-dim">
            GO Driving Tuition teaches across Stockport and south Manchester, covering Poynton,
            Bramhall, Cheadle, Stockport, Woodford, Wilmslow and Hazel Grove.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-bone-dim" role="list">
            {["Stockport", "Hazel Grove", "Cheadle", "Bramhall", "Woodford", "Wilmslow", "Poynton"].map((a) => (
              <li key={a} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 flex-none bg-go-500" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs leading-relaxed text-bone-faint">
            The map shows an approximate service area only. Coverage depends on instructor
            availability.
          </p>
        </div>

        <figure ref={figureRef} data-reveal="right" className="min-w-0">
          <svg
            viewBox="0 0 800 600"
            className="w-full max-w-full border border-asphalt-600 bg-asphalt-950"
            role="img"
            aria-label="Stylised map of the approximate GO Driving Tuition service area, centred on Stockport and extending into Manchester"
          >
            {/* Faint road-like lines for texture */}
            <g stroke="#1d3a22" strokeWidth="3" fill="none">
              <path className="map-road" d="M60 480 C 220 420, 300 300, 250 60" />
              <path className="map-road" d="M100 380 C 300 360, 500 340, 760 300" />
              <path className="map-road" d="M480 590 C 470 450, 420 250, 300 20" />
              <path className="map-road" d="M700 520 C 600 420, 480 380, 250 105" />
            </g>

            {/* Approximate coverage zone */}
            <path
              className="map-zone"
              d="M 160 100 C 300 40, 480 60, 580 130 C 680 200, 700 340, 670 450
                 C 640 545, 480 570, 340 555 C 220 540, 150 450, 160 330 C 165 240, 130 160, 160 100 Z"
              fill="#8dc63f"
              fillOpacity="0.14"
              stroke="#8dc63f"
              strokeWidth="2"
              strokeDasharray={ZONE_DASH}
            />

            {/* Region label */}
            <text
              className="map-label"
              x="150"
              y="70"
              fill="#8a8880"
              fontSize="15"
              fontStyle="italic"
              fontFamily="Inter, sans-serif"
            >
              South Manchester
            </text>

            {AREAS.map((a) => (
              <g key={a.name}>
                <circle
                  className="map-dot"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  cx={a.x}
                  cy={a.y}
                  r={a.major ? 8 : 5}
                  fill={a.major ? "#8dc63f" : "#05100a"}
                  stroke="#8dc63f"
                  strokeWidth="2"
                />
                <text
                  className="map-label"
                  x={a.x + 14}
                  y={a.y + 5}
                  fill={a.major ? "#ece9e2" : "#b9b6ae"}
                  fontSize={a.major ? 19 : 15}
                  fontWeight={a.major ? 700 : 400}
                  fontFamily="Inter, sans-serif"
                >
                  {a.name}
                </text>
              </g>
            ))}
          </svg>
        </figure>
      </div>
    </section>
  );
}
