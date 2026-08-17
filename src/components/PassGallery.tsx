/**
 * Pass-photo strips — real GO learners with their certificates,
 * scattered through the page in small polaroid clusters to break up
 * the sections. Kept small and tasteful.
 */

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

const ALTS: Record<number, string> = {
  1: "GO learner holding her practical test pass certificate beside the learner car",
  2: "GO learner holding his pass certificate next to the learner car",
  3: "GO learner holding his pass certificate by the open car door",
  4: "GO learner with his pass certificate in front of the learner car",
  5: "GO learner giving a thumbs up with his pass certificate inside the car",
  6: "GO learner holding her pass certificate beside the learner car on a sunny street",
  7: "GO learner with her pass certificate behind the red learner car",
  8: "GO learner holding her pass certificate in front of the learner car",
  9: "GO learner with her pass certificate by the open car door",
  10: "GO learner holding her pass certificate next to the GO learner car",
  11: "GO learner holding her pass certificate beside the black learner car",
  12: "GO learner holding his pass certificate beside the learner car on a rainy street",
  13: "GO learner holding her pass certificate next to the black learner car",
  14: "GO learner with her pass certificate behind the red learner car",
  15: "GO learner holding her pass certificate in front of the black learner car",
  16: "GO learner smiling with her pass certificate and keys beside the learner car",
};

interface PassStripProps {
  /** Which pass photos to show (1-11) */
  photos: number[];
  /** Background + caption colouring to match the surrounding sections */
  tone?: "dark" | "light" | "deep";
  caption?: string;
}

const TONE_BG: Record<NonNullable<PassStripProps["tone"]>, string> = {
  dark: "bg-asphalt-950",
  light: "bg-bone-white",
  deep: "bg-go-950",
};

export default function PassStrip({ photos, tone = "dark", caption }: PassStripProps) {
  return (
    <aside aria-label="Recent passes" className={`${TONE_BG[tone]} px-6 py-14`}>
      <div className="mx-auto max-w-5xl">
        {caption && (
          <p
            className={`mb-8 text-center text-sm tracking-[0.35em] uppercase ${
              tone === "light" ? "text-go-700" : "text-go-500"
            }`}
            data-reveal
            data-once
          >
            {caption}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-6" data-reveal-stagger data-once>
          {photos.map((n, i) => (
            <figure
              key={n}
              className={`${TILTS[i % TILTS.length]} w-52 flex-none border-4 border-white bg-white shadow-lg transition-transform duration-300 hover:rotate-0 hover:scale-105 sm:w-64`}
            >
              <img
                src={`/images/passes/pass-${n}.jpg`}
                alt={ALTS[n]}
                loading="lazy"
                className="h-56 w-full object-cover object-top sm:h-72"
              />
              <figcaption className="py-2 text-center text-[11px] font-semibold tracking-wide text-asphalt-800">
                PASSED with GO
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </aside>
  );
}
