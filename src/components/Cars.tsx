import { useState, type ReactNode } from "react";

interface Feature {
  label: string;
  detail: string;
  icon: ReactNode;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Only what matters to a learner — no padding with standard-car kit. */
const FEATURES: Feature[] = [
  {
    label: "Dual controls",
    detail: "Your instructor can step in at any moment, so you can push on with confidence.",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <circle cx="8" cy="12" r="5" />
        <circle cx="16" cy="12" r="5" />
      </svg>
    ),
  },
  {
    label: "High safety rating",
    detail: "Modern, crash-tested cars that are immaculately maintained and always clean.",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Excellent all-round visibility",
    detail: "Big glass, clear sightlines and well-set mirrors make observations easier to learn.",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Fully adjustable seats",
    detail: "Set the perfect driving position whatever your height, so comfort helps you focus.",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M8 4v9a2 2 0 0 0 2 2h6" />
        <path d="M8 13l-2 6" />
        <path d="M16 15l2 4" />
      </svg>
    ),
  },
];

/** The GO fleet. Add a car by dropping its photo in public/images and
 *  adding an entry here. Each card flips to show one standout feature. */
const FLEET = [
  {
    src: "/images/go-car.jpg",
    name: "SEAT Leon",
    note: "Compact, refined hatchback",
    alt: "Black GO Driving Tuition SEAT Leon learner car with GO DRIVING plate",
    feature: FEATURES[0],
  },
  {
    src: "/images/go-car-golf.jpg",
    name: "Volkswagen Golf",
    note: "Smooth, easy-to-place hatchback",
    alt: "Black GO Driving Tuition Volkswagen Golf learner car with GO DRIVING plate",
    feature: FEATURES[1],
  },
  {
    src: "/images/go-car-arona.jpg",
    name: "SEAT Arona",
    note: "Higher-set, great visibility",
    alt: "Black GO Driving Tuition SEAT Arona learner car with GO DRIVING plate",
    feature: FEATURES[2],
  },
];

function FleetCard({ src, name, note, alt, feature }: (typeof FLEET)[number]) {
  const [imgFailed, setImgFailed] = useState(false);
  const [pinned, setPinned] = useState(false); // tap-to-flip, for touch screens

  return (
    <figure className="group overflow-hidden border border-asphalt-600 bg-asphalt-950">
      <button
        type="button"
        onClick={() => setPinned((p) => !p)}
        aria-pressed={pinned}
        aria-label={`${name}. Tap to ${pinned ? "show the photo" : `reveal a standout feature: ${feature.label}`}.`}
        className="relative block aspect-[16/10] w-full cursor-pointer [perspective:1400px] focus:outline-none"
      >
        <div
          className={`absolute inset-0 [transform-style:preserve-3d] transition-transform duration-700 ease-out motion-reduce:transition-none ${
            pinned ? "[transform:rotateY(180deg)]" : ""
          } group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]`}
        >
          {/* Front — the photo */}
          <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]">
            {imgFailed ? (
              <div
                className="flex h-full w-full items-center justify-center bg-asphalt-800 text-center text-xs text-bone-faint"
                role="img"
                aria-label={`${alt}. Photo to follow.`}
              >
                Photo
                <br />
                to follow
              </div>
            ) : (
              <img
                src={src}
                alt={alt}
                loading="lazy"
                onError={() => setImgFailed(true)}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            {/* Hint that the card is interactive */}
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-bone/40 bg-asphalt-950/60 text-bone backdrop-blur-sm transition-colors group-hover:border-go-500 group-hover:text-go-400"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12a8 8 0 0 1 14.5-4.5M20 12a8 8 0 0 1-14.5 4.5" />
                <path d="M18 4v4h-4M6 20v-4h4" />
              </svg>
            </span>
          </div>

          {/* Back — a standout feature */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-go-950 p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="h-9 w-9 text-go-500">{feature.icon}</span>
            <p className="display text-lg text-bone">{feature.label}</p>
            <p className="max-w-xs text-sm leading-relaxed text-bone-dim">{feature.detail}</p>
          </div>
        </div>
      </button>

      <figcaption className="flex items-baseline justify-between border-t border-asphalt-600 px-4 py-3">
        <span className="font-semibold text-bone">{name}</span>
        <span className="text-xs text-bone-faint">{note}</span>
      </figcaption>
    </figure>
  );
}

export default function Cars() {
  return (
    <section id="cars" aria-label="Our cars" className="relative bg-asphalt-900 px-6 py-24 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <p className="text-sm tracking-[0.35em] uppercase text-go-500">Our cars</p>
          <h2 className="display mt-4 max-w-3xl text-4xl text-bone md:text-6xl">
            Enjoy your driving with a smart GO car.
          </h2>
        </div>

        <p className="mt-8 max-w-3xl leading-relaxed text-bone-dim" data-reveal>
          We want you to enjoy a positive and comfortable driving experience at GO. Our cars are
          smart, modern and well equipped, responsive, compact and easy to drive.
        </p>

        {/* The fleet */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
          {FLEET.map((car) => (
            <FleetCard key={car.name} {...car} />
          ))}
        </div>

      </div>
    </section>
  );
}
