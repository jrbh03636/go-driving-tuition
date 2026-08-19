import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, createSpring } from "animejs";

interface Panel {
  title: string;
  content: ReactNode;
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-go-700 underline underline-offset-4 hover:text-go-800"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

const PANELS: Panel[] = [
  {
    title: "Obtaining a provisional driving licence",
    content: (
      <>
        <p>
          You need a provisional driving licence before starting driving lessons. You can apply
          from age 15 years and 9 months, and start learning to drive a car at 17.
        </p>
        <p className="mt-3">
          Applications are made through the DVLA, online or with a form from the Post Office.
        </p>
        <p className="mt-3">
          <ExternalLink href="https://www.gov.uk/apply-first-provisional-driving-licence">
            Apply for your first provisional driving licence (DVLA)
          </ExternalLink>
        </p>
      </>
    ),
  },
  {
    title: "The theory test",
    content: (
      <>
        <p>
          The theory test has two parts, taken in one sitting: a multiple-choice section and a
          hazard-perception section. You must pass both parts to pass the test, and you must pass
          the theory test before booking your practical driving test.
        </p>
        <p className="mt-3">
          <ExternalLink href="https://www.gov.uk/book-theory-test">
            Book your theory test (DVSA)
          </ExternalLink>
        </p>
      </>
    ),
  },
  {
    title: "The practical driving test",
    content: (
      <>
        <p>The practical test assesses that you can drive safely and includes:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>An eyesight check</li>
          <li>Vehicle safety questions (‘show me, tell me’)</li>
          <li>General driving ability</li>
          <li>A reversing exercise</li>
          <li>Approximately 20 minutes of independent driving</li>
        </ul>
        <p className="mt-3">Total driving time is approximately 40 minutes.</p>
        <p className="mt-3">
          <ExternalLink href="https://www.gov.uk/book-driving-test">
            Book your practical driving test (DVSA)
          </ExternalLink>
        </p>
      </>
    ),
  },
  {
    title: "Documents required on test day",
    content: (
      <>
        <p>You must bring the correct licence and test documentation with you, including:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Your provisional driving licence photocard</li>
          <li>Your theory test pass certificate number (for the practical test)</li>
          <li>Your test booking confirmation</li>
        </ul>
        <p className="mt-3">
          If you don’t bring the right documents, your test may be cancelled and you could lose
          your fee.
        </p>
      </>
    ),
  },
  {
    title: "Vehicle safety questions",
    content: (
      <>
        <p>
          During the practical test the examiner asks vehicle safety questions, known as ‘show
          me, tell me’. A ‘tell me’ question is answered at the start of the test; a ‘show me’
          question is answered while you’re driving.
        </p>
        <p className="mt-3">
          <ExternalLink href="https://www.gov.uk/government/publications/car-show-me-tell-me-vehicle-safety-questions">
            Official ‘show me, tell me’ questions (DVSA)
          </ExternalLink>
        </p>
      </>
    ),
  },
  {
    title: "The Highway Code",
    content: (
      <>
        <p>
          The Highway Code applies to all road users and is essential reading for both the theory
          test and safe driving for life.
        </p>
        <p className="mt-3">
          <ExternalLink href="https://www.gov.uk/guidance/the-highway-code">
            Read The Highway Code
          </ExternalLink>
        </p>
      </>
    ),
  },
  {
    title: "Road-safety resources",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <ExternalLink href="https://www.think.gov.uk/">Think! road safety campaigns</ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.brake.org.uk/">Brake, the road safety charity</ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.rospa.com/">
            RoSPA, The Royal Society for the Prevention of Accidents
          </ExternalLink>
        </li>
      </ul>
    ),
  },
];

export default function UsefulInfo() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstRender = useRef(true);

  // Newly opened panel unfolds with a spring (skipped for reduced motion
  // and for the panel that is open on first paint).
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (open === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panel = panelRefs.current[open];
    if (!panel) return;
    const full = panel.scrollHeight;
    animate(panel, {
      height: [0, full],
      opacity: [0, 1],
      translateY: [-8, 0],
      duration: 650,
      ease: createSpring({ stiffness: 240, damping: 20 }),
      onComplete() {
        panel.style.height = "";
        panel.style.opacity = "";
        panel.style.transform = "";
      },
    });
  }, [open]);

  return (
    <section id="info" aria-label="Useful information" className="bg-bone-white px-6 py-12 md:py-36">
      <div className="mx-auto max-w-3xl">
        <div data-reveal>
          <p className="text-sm font-semibold tracking-[0.35em] uppercase text-go-800">Useful information</p>
          <h2 className="display mt-4 text-3xl text-asphalt-950 md:text-6xl">
            Vital driving information, right here.
          </h2>
        </div>

        <div className="mt-8 divide-y divide-asphalt-950/15 border-y border-asphalt-950/15 md:mt-12">
          {PANELS.map((panel, i) => {
            const expanded = open === i;
            return (
              <div key={panel.title}>
                <h3>
                  <button
                    type="button"
                    id={`${uid}-btn-${i}`}
                    aria-expanded={expanded}
                    aria-controls={`${uid}-panel-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium text-asphalt-950 transition-colors hover:text-go-700"
                  >
                    {panel.title}
                    <svg
                      viewBox="0 0 16 16"
                      className={`h-4 w-4 flex-none text-go-700 transition-transform duration-200 ${
                        expanded ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                </h3>
                <div
                  id={`${uid}-panel-${i}`}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  role="region"
                  aria-labelledby={`${uid}-btn-${i}`}
                  hidden={!expanded}
                  className="overflow-hidden pb-6 text-sm leading-relaxed text-asphalt-500"
                >
                  {panel.content}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-asphalt-500 md:mt-8">
          Government rules, fees and test procedures can change. Always confirm the latest
          requirements through the official DVLA and DVSA pages linked above.
        </p>
      </div>
    </section>
  );
}
