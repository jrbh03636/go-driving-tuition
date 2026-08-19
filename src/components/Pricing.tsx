export default function Pricing() {
  return (
    <section id="pricing" aria-label="Pricing" className="bg-bone-white px-6 py-12 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <p className="text-sm font-semibold tracking-[0.35em] uppercase text-go-800">Pricing</p>
          <h2 className="display mt-4 text-3xl text-asphalt-950 md:text-6xl">
            Straightforward. Like it should be.
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:mt-14 md:grid-cols-2" data-reveal-stagger>
          {/* Standard lesson */}
          <article data-tilt className="flex flex-col border border-asphalt-950/15 bg-white p-6 md:p-12">
            <h3 className="display text-2xl text-asphalt-950">Standard Lesson</h3>
            <p className="mt-6">
              <span className="display text-5xl text-asphalt-950 md:text-6xl">£45</span>
              <span className="ml-2 text-asphalt-500">per hour</span>
            </p>
            <p className="mt-6 text-asphalt-500">
              Flexible learner tuition tailored to the learner’s individual needs and ability.
            </p>
            <a
              href="#book"
              className="mt-auto inline-flex min-h-11 items-center justify-center border border-asphalt-950 px-8 py-3 text-sm font-semibold tracking-wide text-asphalt-950 uppercase transition-colors hover:border-go-700 hover:text-go-700"
              style={{ marginTop: "auto" }}
            >
              Book a lesson
            </a>
          </article>

          {/* GO 10 — best value */}
          <article data-tilt className="relative flex flex-col border-2 border-go-600 bg-white p-6 md:p-12">
            <p className="absolute -top-4 left-8 bg-go-500 px-4 py-1 text-xs font-bold tracking-[0.2em] text-asphalt-950 uppercase">
              Best value
            </p>
            <h3 className="display text-2xl text-go-700">GO 10</h3>
            <p className="mt-6">
              <span className="display text-5xl text-asphalt-950 md:text-6xl">£445</span>
              <span className="ml-2 text-asphalt-500">for 10 hours</span>
            </p>
            <p className="mt-6 text-asphalt-500">
              £44.50 per hour. Ten hours of tuition, booked as a block.
            </p>
            <a
              href="#book"
              className="mt-10 inline-flex min-h-11 items-center justify-center bg-go-500 px-8 py-3 text-sm font-semibold tracking-wide text-asphalt-950 uppercase transition-colors hover:bg-go-400"
              style={{ marginTop: "auto" }}
            >
              Book GO 10
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
