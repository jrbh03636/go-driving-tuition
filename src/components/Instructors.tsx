/**
 * Two brand-supplied points about the GO instructor team, in place of
 * individual instructor photo cards (none are available yet).
 */

export default function Instructors() {
  return (
    <section id="instructors" aria-label="Instructors" className="bg-bone-white px-6 py-12 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div data-reveal>
          <p className="text-sm font-semibold tracking-[0.35em] uppercase text-go-800">Our instructors</p>
          <h2 className="display mt-4 max-w-3xl text-3xl text-asphalt-950 md:text-6xl">
            Building your confidence and skills.
          </h2>
        </div>

        <div className="mt-6 grid gap-x-12 gap-y-6 md:mt-10 md:gap-y-10 md:grid-cols-2" data-reveal-stagger>
          <p className="border-t-4 border-go-500 pt-6 leading-relaxed text-asphalt-500">
            You can be sure of feeling absolutely safe and at ease when you take driving lessons
            with GO; all our instructors have been graded an A, following an official DVSA
            assessment. This means our instructors are in the top percentage in the country.
          </p>

          <div className="border-t-4 border-go-500 pt-6">
            <p className="text-sm font-semibold tracking-[0.35em] uppercase text-go-800">
              Focus on you
            </p>
            <p className="mt-4 leading-relaxed text-asphalt-500">
              Friendly, patient and calm, our instructors are particularly experienced in making
              first-time and nervous drivers comfortable and at home behind the wheel.
              Professional, courteous and reliable, they’ll provide excellent one-to-one tuition
              and give you 100% dedication and care.
            </p>
          </div>
        </div>

        <a
          href="#book"
          data-spring
          className="mt-8 inline-flex min-h-12 items-center bg-go-500 px-9 py-3 text-sm font-bold tracking-widest text-asphalt-950 uppercase transition-colors hover:bg-go-400 md:mt-12"
        >
          Book a lesson
        </a>
      </div>
    </section>
  );
}
