import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, createSpring } from "animejs";

interface Clause {
  title: string;
  content: ReactNode;
}

const CLAUSES: Clause[] = [
  {
    title: "1) Driving licence",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Customers must personally ensure that they are the holders of a valid, signed, current
          driving licence — which must be produced at the first lesson, and will be regularly
          checked by their driving instructor.
        </li>
        <li>
          Customers must inform their driving instructor if they receive any endorsements on
          their licence during the time they are receiving tuition.
        </li>
        <li>
          Customers must inform their driving instructor of any disabilities they have that might
          affect their ability to drive.
        </li>
      </ol>
    ),
  },
  {
    title: "2) Driving tuition",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>Lessons normally start from the customer’s home, college or a place agreed by mutual arrangement.</li>
        <li>
          Lessons will be agreed usually beforehand. It is the responsibility of the customer to
          remember the agreed time and pick-up location.
        </li>
        <li>
          In their own interest customers are advised to be punctual for appointments. The
          instructor will wait for up to 15 minutes. A reciprocal waiting time may be necessary
          for the arrival of the instructor, who may be delayed due to some unforeseen
          circumstance. The lesson will commence from the appointed time or the time of the
          instructor’s arrival if that should be later.
        </li>
        <li>
          The instructor reserves the right to withhold the use of the training vehicle for a
          lesson, if in the opinion of the instructor the customer is:
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Medically unfit (including eyesight)</li>
            <li>Under the influence of drugs or alcohol</li>
            <li>Not properly licensed to drive</li>
            <li>Consistently failing to keep, or late for, appointments</li>
            <li>In arrears over payment</li>
            <li>Or, for any other reason, considered unsafe to handle a motor vehicle</li>
          </ul>
        </li>
      </ol>
    ),
  },
  {
    title: "3) Customer wellbeing",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          In the interest of comfort and safety, customers are advised to wear suitable footwear
          and comfortable clothing which does not restrict movement — please ask your instructor
          for any advice you may require.
        </li>
      </ol>
    ),
  },
  {
    title: "4) Postponement of a lesson by the driving instructor",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          If, due to a vehicle failure or other emergency, a lesson must be postponed at short
          notice, an alternative appointment will be made with mutual consent. If the postponement
          is a driving test, the instructor will be responsible for the test fee if it cannot be
          cancelled within the required time, regardless of the customer’s continuation of lessons
          with the instructor.
        </li>
        <li>
          Driving tests take priority over lessons; therefore, pre-booked lessons may have to be
          cancelled or postponed if the instructor receives short notice of a driving test
          appointment.
        </li>
        <li>
          Except as provided for in (1) above, the instructor will give notice of rearrangement or
          postponement of a lesson within the same time limit as the instructor imposes upon a
          customer postponing or cancelling a lesson.
        </li>
      </ol>
    ),
  },
  {
    title: "5) Tuition fees",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>Payment for the first lesson is required to secure an appointment booked in advance.</li>
        <li>Block bookings are non-refundable.</li>
      </ol>
    ),
  },
  {
    title: "6) Postponement or cancellation of lessons by the customer",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          At least 24 hours’ notice of postponement or cancellation of a lesson is required.
          Please note that Saturday, Sunday and public holidays are not counted as working days.
          Late cancellations will be charged for at the published rate.
        </li>
        <li>Notice to the instructor shall be deemed to have been served on the day that the communication is received, where it is timed and recorded.</li>
      </ol>
    ),
  },
  {
    title: "7) Postponement or cancellation of test",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          The instructor cannot be held responsible for any postponement or cancellation of a test
          by the testing authority — at whatever notice.
        </li>
        <li>
          Customers should note that where lessons or tuition vehicle hire are cancelled at short
          notice, because of a cancellation by the testing authority, fees are still payable. It
          may be possible for customers to claim lost fees from the testing authority.
        </li>
      </ol>
    ),
  },
  {
    title: "8) Instructor guarantee",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>The instructor guarantees that only legally authorised instructors will give tuition.</li>
        <li>Instructors’ official authorising documents will be displayed on the windscreen of the car, and may be inspected freely at any time.</li>
      </ol>
    ),
  },
  {
    title: "9) The driving test",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Your instructor will advise the appropriate time to make an application for both the
          theory and driving tests. The advice will be based on the customer’s progress to date.
          It does not imply that the necessary standard has been reached, or that it will for
          certain be reached by the appointed test date; the instructor will not hesitate to
          advise, where necessary, the postponement of the test. This condition is intended to
          save the client expense, unnecessary failure, and the consequent delay in waiting for
          another test and obtaining a full licence.
        </li>
        <li>The instructor reserves the right to withhold the use of the tuition vehicle for test purposes.</li>
      </ol>
    ),
  },
  {
    title: "10) Insurance",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>School cars are fully insured for tuition and driving tests.</li>
        <li>No liability of any kind can be accepted by the instructor for the loss of, or damage to, any property belonging to, or in the possession of, the customer.</li>
      </ol>
    ),
  },
  {
    title: "11) Legal liability",
    content: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Customers should be aware that their instructor’s primary objective is to promote road
          safety, and in doing so, will have to issue instructions which customers must be
          prepared to carry out without undue argument.
        </li>
        <li>
          The instructor will make every effort to train you to the highest standard, but can in
          no way be held liable for any errors you commit whilst driving and not accompanied by
          your instructor either before or after a test pass.
        </li>
        <li>
          During an official driving test the client is in charge of the vehicle and is liable
          for any fines or charges levied as a result of any motoring offence committed.
        </li>
      </ol>
    ),
  },
];

/**
 * Collapsible terms & conditions, tucked into the footer alongside the
 * privacy policy — same accordion pattern as PrivacyPolicy/UsefulInfo.
 */
export default function TermsAndConditions() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const panel = panelRef.current;
    if (!panel || !open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    <div className="mx-auto mt-4 max-w-6xl">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="terms-conditions-panel"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[0.25em] text-bone-faint uppercase transition-colors hover:text-go-400"
      >
        Terms &amp; conditions
        <svg
          viewBox="0 0 16 16"
          className={`h-3 w-3 flex-none transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      <div
        id="terms-conditions-panel"
        ref={panelRef}
        hidden={!open}
        className="overflow-hidden pt-6 text-sm leading-relaxed text-bone-dim"
      >
        <div className="max-w-3xl space-y-8 border-t border-asphalt-700 pt-6">
          {CLAUSES.map((clause) => (
            <div key={clause.title}>
              <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">{clause.title}</h3>
              <div className="mt-3">{clause.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
