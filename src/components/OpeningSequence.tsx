import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoLogo from "./GoLogo";
import { useReducedMotion } from "../lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Opening film: one continuous generated sequence —
 *   1) camera pushes through the "o" of the GO logo into darkness,
 *   2) the black studio reveals the GO learner car, camera circles to its rear,
 *   3) the studio becomes a suburban street and the car drives away.
 *
 * The film is scrubbed by scroll while the section is pinned, so
 * scrolling down plays it forward and scrolling up reverses it.
 * A separate control plays the film start-to-finish with sound.
 */

const FILM = {
  src: "/videos/opening-film.mp4",
  mobileSrc: "/videos/opening-film-mobile.mp4",
  poster: "/videos/opening-film-poster.jpg",
  carPoster: "/videos/opening-film-car-poster.jpg",
  label:
    "GO Driving Tuition film: the camera travels through the GO logo, reveals the learner car in a dark studio, then the car drives away down a quiet suburban street",
};

/** Total film length in seconds (3 stitched clips). Read from metadata at runtime; this is the fallback. */
const FILM_FALLBACK_DURATION = 17;

export default function OpeningSequence() {
  const reduced = useReducedMotion();
  return reduced ? <StaticOpening /> : <ScrollOpening />;
}

/* ------------------------------------------------------------------ */
/* Reduced motion: static logo, then a static car hero                 */
/* ------------------------------------------------------------------ */

function StaticOpening() {
  return (
    <header>
      <div className="relative flex h-svh items-center justify-center bg-asphalt-950">
        <GoLogo className="w-64 md:w-80" idPrefix="static" />
        <p className="absolute bottom-10 text-sm tracking-[0.3em] uppercase text-bone-faint">
          Stockport &amp; Manchester
        </p>
      </div>
      <div className="relative vignette">
        <img
          src={FILM.carPoster}
          alt="Black GO Driving Tuition learner car with its roof box, photographed in a dark studio"
          className="h-svh w-full object-cover"
        />
        <div className="absolute inset-0 z-6 flex items-end justify-center bg-gradient-to-t from-asphalt-950 via-transparent to-transparent pb-16">
          <h1 className="display text-4xl text-bone md:text-6xl">
            Pass at <span className="text-go-500">GO</span>.
          </h1>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------- */
/* Full experience: pinned, scroll-scrubbed film + sound control   */
/* ------------------------------------------------------------- */

function ScrollOpening() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playingRef = useRef(false); // true while the sound playthrough runs
  const [videoFailed, setVideoFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const video = videoRef.current;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          pin: stageRef.current,
          anticipatePin: 1,
          onUpdate(self) {
            if (!video || playingRef.current) return;
            const dur = video.duration && !Number.isNaN(video.duration)
              ? video.duration
              : FILM_FALLBACK_DURATION;
            const t = Math.min(dur - 0.05, Math.max(0, self.progress * dur));
            if (Math.abs(video.currentTime - t) > 0.04) {
              video.currentTime = t;
            }
          },
        },
      });

      // Scroll hint fades as soon as the journey starts.
      tl.to(hintRef.current, { autoAlpha: 0, duration: 0.03 }, 0.015);

      // "Pass at GO." rises over the drive-away and stays until release.
      tl.fromTo(
        taglineRef.current,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.1, ease: "power1.out" },
        0.8
      );

      // Ease down into the page.
      tl.to(stageRef.current, { opacity: 0.4, duration: 0.035 }, 0.965);
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  function startSoundPlaythrough() {
    const video = videoRef.current;
    if (!video || playingRef.current) return;
    playingRef.current = true;
    setPlaying(true);
    video.muted = false;
    video.currentTime = 0;
    void video.play().catch(() => stopSoundPlaythrough());
    video.onended = () => stopSoundPlaythrough();
  }

  function stopSoundPlaythrough() {
    const video = videoRef.current;
    playingRef.current = false;
    setPlaying(false);
    if (video) {
      video.onended = null;
      video.pause();
      video.muted = true;
      ScrollTrigger.refresh(); // re-sync the scrubbed frame to the scroll position
    }
  }

  return (
    <section ref={sectionRef} aria-label="Opening film" className="relative h-[520vh]">
      <div ref={stageRef} className="relative h-svh w-full overflow-hidden bg-asphalt-950">
        {/* Film layer */}
        <div className="absolute inset-0 vignette">
          {videoFailed ? (
            <div className="flex h-full w-full items-center justify-center bg-asphalt-950">
              <GoLogo className="w-64 md:w-80" idPrefix="fallback" />
            </div>
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={isMobile ? FILM.mobileSrc : FILM.src}
              poster={FILM.poster}
              muted
              playsInline
              preload="auto"
              aria-label={FILM.label}
              onError={() => setVideoFailed(true)}
            />
          )}
        </div>

        {/* Tagline */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center pb-[16vh]">
          <h1 ref={taglineRef} className="display text-5xl text-bone opacity-0 md:text-7xl">
            Pass at <span className="text-go-500">GO</span>.
          </h1>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2 text-bone-faint"
          aria-hidden="true"
        >
          <span className="text-xs tracking-[0.35em] uppercase">Scroll</span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" className="animate-bounce">
            <path d="M8 2v16m0 0 6-6m-6 6-6-6" stroke="#8dc63f" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Sound playthrough control */}
        {!videoFailed && (
          <button
            type="button"
            onClick={playing ? stopSoundPlaythrough : startSoundPlaythrough}
            className="absolute right-4 bottom-6 z-30 inline-flex min-h-11 items-center gap-2 border border-bone-faint/50 bg-asphalt-950/70 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-bone uppercase backdrop-blur transition-colors hover:border-go-500 hover:text-go-400 md:right-8"
          >
            {playing ? (
              <>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M3 3h4v10H3zM9 3h4v10H9z" fill="currentColor" />
                </svg>
                Stop film
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M4 2l9 6-9 6V2z" fill="currentColor" />
                </svg>
                Play film with sound
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
