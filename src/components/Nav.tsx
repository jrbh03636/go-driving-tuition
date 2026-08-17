import { useEffect, useState } from "react";

// Ordered to match the sections as they appear down the page.
const LINKS = [
  { label: "about us", href: "#about" },
  { label: "lessons", href: "#lessons" },
  { label: "prices", href: "#pricing" },
  { label: "cars", href: "#cars" },
  { label: "instructors", href: "#instructors" },
  { label: "info", href: "#info" },
  { label: "contact", href: "#contact" },
];

/**
 * Transparent over the hero so the video shows through; once the page
 * scrolls past it, the bar solidifies (dark background, blur, phone +
 * booking CTA) so it stays legible and useful over the lighter
 * sections below.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-asphalt-700/60 bg-asphalt-950/85 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <a
          href="#top"
          className="flex flex-none items-center self-start pt-1"
          aria-label="GO Driving Tuition, back to top"
        >
          <img
            src="/images/go-logo-badge.png"
            alt="GO Driving Tuition"
            className="h-16 w-auto drop-shadow-lg md:h-20"
          />
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-sm tracking-[0.15em] text-bone uppercase transition-colors duration-200 hover:text-go-400"
              >
                {l.label}
                <span
                  aria-hidden="true"
                  className="absolute right-0 -bottom-1.5 left-0 h-0.5 origin-left scale-x-0 bg-go-500 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <div
          className={`flex flex-none items-center gap-4 transition-opacity duration-300 ${
            solid ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <a
            href="tel:+447988753966"
            className="hidden text-sm text-bone-dim hover:text-go-400 md:inline"
          >
            07988 753 966
          </a>
          <a
            href="#book"
            data-spring
            className="inline-flex min-h-11 items-center bg-go-500 px-5 py-2 text-xs font-bold tracking-widest text-asphalt-950 uppercase hover:bg-go-400"
          >
            Book now!
          </a>
        </div>
      </div>
    </nav>
  );
}
