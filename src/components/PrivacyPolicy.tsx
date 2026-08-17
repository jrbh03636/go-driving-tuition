import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, createSpring } from "animejs";

/**
 * Collapsible privacy & cookies policy, tucked into the footer. Closed by
 * default; expands in place when the button is clicked, echoing the
 * accordion pattern used in UsefulInfo. Also opens in response to an
 * "open-privacy-policy" window event, so links elsewhere on the site (e.g.
 * the booking form's consent checkbox) can jump straight to it expanded.
 */
export default function PrivacyPolicy() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const onOpenRequest = () => setOpen(true);
    window.addEventListener("open-privacy-policy", onOpenRequest);
    return () => window.removeEventListener("open-privacy-policy", onOpenRequest);
  }, []);

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
    <div id="privacy-policy" className="mx-auto mt-8 max-w-6xl scroll-mt-24">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="privacy-policy-panel"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 items-center gap-2 text-xs font-semibold tracking-[0.25em] text-bone-faint uppercase transition-colors hover:text-go-400"
      >
        Privacy &amp; cookies policy
        <svg
          viewBox="0 0 16 16"
          className={`h-3 w-3 flex-none transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      <div
        id="privacy-policy-panel"
        ref={panelRef}
        hidden={!open}
        className="overflow-hidden pt-6 text-sm leading-relaxed text-bone-dim"
      >
        <div className="max-w-3xl space-y-8 border-t border-asphalt-700 pt-6">
          <div>
            <p className="text-xs text-bone-faint">Last updated: 16 August 2026</p>
            <p className="mt-3">
              GO Driving Tuition (“we”, “us”, “our”) is committed to protecting your privacy.
              This policy explains what personal data we collect through this website, why we
              collect it, and what your rights are.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">Who we are</h3>
            <p className="mt-3">GO Driving Tuition is a driving instruction business based in Bramhall, Stockport.</p>
            <p className="mt-3">
              Contact: Alison Richardson
              <br />
              Address: 5 Hardy Drive, Bramhall, Stockport, SK7 2BW
              <br />
              Email:{" "}
              <a href="mailto:ar@go-drivingtuition.com" className="text-bone underline underline-offset-4 hover:text-go-400">
                ar@go-drivingtuition.com
              </a>
              <br />
              Phone:{" "}
              <a href="tel:+447988753966" className="text-bone underline underline-offset-4 hover:text-go-400">
                07988 753 966
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">What data we collect</h3>
            <p className="mt-3">When you use the enquiry form on this website, we collect:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Your phone number</li>
              <li>Any message or details you enter about the lessons you’re interested in</li>
            </ul>
            <p className="mt-3">We do not collect payment information through this website.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">Why we collect it</h3>
            <p className="mt-3">We use this information only to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Respond to your enquiry about driving lessons</li>
              <li>Arrange and manage your lessons if you become a customer</li>
              <li>Contact you about your bookings (e.g. confirming or rescheduling a lesson)</li>
            </ul>
            <p className="mt-3">
              The lawful basis for this processing is legitimate interest (responding to enquiries
              you’ve made) and, once you become a customer, contract (providing the lessons you’ve
              booked).
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">How long we keep it</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Enquiries that don’t turn into a booking: kept for up to 12 months, then deleted.</li>
              <li>
                Customer contact details: kept for as long as you’re an active customer, plus a
                reasonable period afterwards for record-keeping (e.g. in case you return for
                further lessons).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">Who we share it with</h3>
            <p className="mt-3">
              We do not sell or share your personal data with third parties for marketing
              purposes.
            </p>
            <p className="mt-3">We may share limited data with:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Our email provider, to send and receive messages</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">Analytics</h3>
            <p className="mt-3">
              This site uses Vercel Web Analytics, a privacy-focused analytics tool that does not
              use cookies and does not collect any information that identifies you personally. It
              only records anonymous, aggregated data (such as page views) to help us understand
              how the site is used. No consent is required for this because it doesn’t process
              personal data or store anything on your device.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">Your rights</h3>
            <p className="mt-3">Under UK GDPR, you have the right to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Ask what personal data we hold about you</li>
              <li>Ask us to correct inaccurate data</li>
              <li>Ask us to delete your data</li>
              <li>Object to how we’re using your data</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:ar@go-drivingtuition.com" className="text-bone underline underline-offset-4 hover:text-go-400">
                ar@go-drivingtuition.com
              </a>
              .
            </p>
            <p className="mt-3">
              If you’re unhappy with how we’ve handled your data, you can complain to the
              Information Commissioner’s Office (ICO) at{" "}
              <a
                href="https://ico.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone underline underline-offset-4 hover:text-go-400"
              >
                ico.org.uk
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] text-bone uppercase">Changes to this policy</h3>
            <p className="mt-3">
              We may update this policy from time to time. The date at the top shows when it was
              last revised.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
