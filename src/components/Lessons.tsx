interface LessonCard {
  kicker: string;
  heading: string;
  paragraphs: string[];
  price: string;
  cta: string;
  ctaHref: string;
}

const LESSONS: LessonCard[] = [
  {
    kicker: "Standard Lessons",
    heading: "Lessons using the best modern training techniques",
    paragraphs: [
      "You’ll benefit from the latest driver-training techniques at GO Driving Tuition. These follow the DVSA syllabus and can be tailored to meet your individual needs and abilities.",
      "At the start of every lesson, you’ll know what the objectives are. Any new subjects will be taught in a clear and easy-to-follow way.",
      "At the end of the lesson, you’ll review how you got on and understand the aims of your next lesson. If you’re doing any private driving practice, we’ll also give you advice on what you need to work on.",
    ],
    price: "£45 per hour",
    cta: "Book a lesson",
    ctaHref: "#book",
  },
  {
    kicker: "Refresher Courses",
    heading: "Confidence back behind the wheel",
    paragraphs: [
      "If you feel nervous or daunted by driving, or you haven’t driven for a long time, a refresher course can help you rebuild your confidence with a professional instructor beside you.",
      "It may be motorway driving that prevents you from visiting friends, or parking that stops you from visiting your favourite shops. Whatever the reason, contact us to discuss how we can help you feel confident behind the wheel again.",
    ],
    price: "Contact us",
    cta: "Ask about refresher courses",
    ctaHref: "#book",
  },
];

export default function Lessons() {
  return (
    <section id="lessons" aria-label="Our lessons" className="bg-asphalt-900 px-0 py-12 md:py-36">
      <div className="mx-auto max-w-7xl px-6" data-reveal>
        <p className="text-sm tracking-[0.35em] uppercase text-go-500">Our lessons</p>
        <h2 className="display mt-4 max-w-3xl text-3xl text-bone md:text-6xl">
          Two ways to learn. One standard.
        </h2>
      </div>

      {/* Desktop: side by side. Mobile: horizontal swipe with snap. */}
      <div className="mt-8 md:mx-auto md:mt-14 md:max-w-7xl md:px-6">
        <div
          className="snap-row flex gap-5 overflow-x-auto px-6 pb-4 md:grid md:grid-cols-2 md:overflow-visible md:px-0"
          data-reveal-stagger
        >
          {LESSONS.map((lesson) => (
            <article
              key={lesson.kicker}
              className="group relative flex w-[86vw] max-w-md flex-none flex-col border-t-4 border-go-500 bg-bone-white p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-18px_rgba(141,198,63,0.55)] md:w-auto md:max-w-none md:p-12"
            >
              <p className="text-xs font-semibold tracking-[0.35em] uppercase text-go-800">{lesson.kicker}</p>
              <h3 className="display mt-4 text-2xl text-asphalt-950 md:text-4xl">{lesson.heading}</h3>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-asphalt-500 md:mt-6 md:space-y-4 md:text-base">
                {lesson.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div className="mt-auto pt-6 md:pt-10">
                <p className="display text-3xl text-asphalt-950 md:text-4xl">{lesson.price}</p>
                <a
                  href={lesson.ctaHref}
                  className="mt-6 inline-flex min-h-11 items-center justify-center bg-go-500 px-8 py-3 text-sm font-semibold tracking-wide text-asphalt-950 uppercase transition-colors hover:bg-go-400"
                >
                  {lesson.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
