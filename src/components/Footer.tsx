import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

export default function Footer() {
  return (
    <footer id="contact" aria-label="Contact information" className="border-t border-asphalt-700 bg-asphalt-950 px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
        <div>
          <img src="/images/go-logo.png" alt="GO Driving Tuition logo" className="w-32" />
          <p className="mt-4 text-sm text-bone-dim">
            Driving lessons in Stockport, Manchester and surrounding areas.
          </p>
          <p className="display mt-4 text-xl text-go-500">Pass at GO.</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.25em] uppercase text-bone">Talk to us</h2>
          <ul className="mt-4 space-y-3 text-bone-dim">
            <li>
              <a href="tel:+447988753966" className="text-lg text-bone hover:text-go-400">
                07988 753 966
              </a>
            </li>
            <li>
              <a href="tel:+447951238576" className="text-lg text-bone hover:text-go-400">
                07951 238 576
              </a>
            </li>
            <li>
              <a
                href="mailto:ar@go-drivingtuition.com"
                className="break-all text-bone hover:text-go-400"
              >
                ar@go-drivingtuition.com
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-bone-faint">
            Free callback: text <strong className="text-bone-dim">“GO”</strong> to either number.
          </p>
          <address className="mt-4 text-sm text-bone-faint not-italic">
            5 Hardy Drive, Bramhall, Stockport, Cheshire, SK7 2BW
          </address>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-[0.25em] uppercase text-bone">Lines open</h2>
          <p className="mt-4 text-bone-dim">Monday to Sunday</p>
          <p className="text-bone-dim">9am – 9pm</p>
          <nav aria-label="Footer" className="mt-6">
            <ul className="space-y-2 text-sm text-bone-faint">
              <li><a href="#lessons" className="hover:text-go-400">Our lessons</a></li>
              <li><a href="#pricing" className="hover:text-go-400">Pricing</a></li>
              <li><a href="#coverage" className="hover:text-go-400">Coverage</a></li>
              <li><a href="#info" className="hover:text-go-400">Useful information</a></li>
              <li><a href="#book" className="hover:text-go-400">Book a lesson</a></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="road-divider mx-auto mt-14 max-w-6xl" aria-hidden="true" />
      <p className="mx-auto mt-6 max-w-6xl text-xs text-bone-faint">
        © {new Date().getFullYear()} GO Driving Tuition. Serving Stockport &amp; Manchester.
      </p>

      <PrivacyPolicy />
      <TermsAndConditions />
    </footer>
  );
}
