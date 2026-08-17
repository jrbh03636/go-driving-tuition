import { useEffect, useState } from "react";

/** Fixed green back-to-top button, shown once the hero has scrolled by. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      data-spring
      className={`fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center bg-go-500 text-asphalt-950 shadow-lg transition-opacity duration-300 hover:bg-go-400 md:right-6 md:bottom-6 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 15V3M9 3 3 9M9 3l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
