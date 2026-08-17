import { useRef, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Preloader from "./components/Preloader";
import CursorFX from "./components/CursorFX";
import ScrollProgress from "./components/ScrollProgress";
import Philosophy from "./components/Philosophy";
import Lessons from "./components/Lessons";
import Pricing from "./components/Pricing";
import Cars from "./components/Cars";
import Instructors from "./components/Instructors";
import Results from "./components/Results";
import PassStrip from "./components/PassGallery";
import Coverage from "./components/Coverage";
import PostcodeChecker from "./components/PostcodeChecker";
import BookingForm from "./components/BookingForm";
import UsefulInfo from "./components/UsefulInfo";
import Marquee from "./components/Marquee";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import { useScrollFx } from "./lib/useScrollFx";

function RoadDivider() {
  return <div className="road-divider mx-auto max-w-6xl" aria-hidden="true" />;
}

export default function App() {
  // Postcode is shared between the checker and the booking form so it
  // never has to be typed twice.
  const [postcode, setPostcode] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  // Scroll-wheel effects: smooth scrolling, reveals, parallax.
  useScrollFx(rootRef);

  return (
    <div id="top" ref={rootRef} className="grain">
      <a
        href="#lessons"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:bg-go-500 focus:px-4 focus:py-2 focus:text-asphalt-950"
      >
        Skip to lessons
      </a>
      <Preloader />
      <CursorFX />
      <Nav />
      <ScrollProgress />
      <main>
        <Hero />
        <Philosophy />
        <PassStrip photos={[4, 6, 12]} tone="light" caption="Real recent passes" />
        <RoadDivider />
        <Lessons />
        <Pricing />
        <PassStrip photos={[5, 7, 13]} tone="light" />
        <RoadDivider />
        <Cars />
        <Results />
        <PassStrip photos={[8, 9, 14]} tone="dark" caption="You could be next" />
        <Instructors />
        <RoadDivider />
        <Coverage />
        <PostcodeChecker onPostcodeConfirmed={setPostcode} />
        <PassStrip photos={[10, 11, 15]} tone="deep" />
        <BookingForm postcode={postcode} onPostcodeChange={setPostcode} />
        <RoadDivider />
        <UsefulInfo />
        <Marquee />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
