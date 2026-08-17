import { useId, useRef, useState, type FormEvent } from "react";
import { checkCoverage, type PostcodeResult } from "../lib/postcodes";

type CheckState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "done"; result: PostcodeResult };

interface PostcodeCheckerProps {
  /** Pushes the checked postcode into the booking form. */
  onPostcodeConfirmed: (postcode: string) => void;
}

export default function PostcodeChecker({ onPostcodeConfirmed }: PostcodeCheckerProps) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<CheckState>({ status: "idle" });
  const inputId = useId();
  const statusRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state.status === "loading") return;
    setState({ status: "loading" });
    try {
      const result = await checkCoverage(value);
      if (!result) {
        setState({ status: "invalid" });
        return;
      }
      setState({ status: "done", result });
      onPostcodeConfirmed(result.normalised);
    } catch {
      setState({ status: "invalid" });
    }
  }

  return (
    <section
      id="postcode"
      aria-label="Postcode coverage checker"
      className="bg-go-950 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-3xl" data-reveal="scale">
        <p className="text-sm tracking-[0.35em] uppercase text-go-500">Coverage check</p>
        <h2 className="display mt-4 text-4xl text-bone md:text-6xl">Do we cover your area?</h2>
        <p className="mt-6 text-bone-dim">
          Enter your postcode to check whether GO Driving Tuition usually operates near you.
        </p>

        <form onSubmit={onSubmit} className="mt-10" noValidate>
          <label htmlFor={inputId} className="block text-sm font-medium text-bone">
            Your postcode
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              id={inputId}
              name="postcode"
              type="text"
              autoComplete="postal-code"
              inputMode="text"
              placeholder="e.g. SK4 2AB"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-describedby={`${inputId}-status`}
              aria-invalid={state.status === "invalid"}
              className="min-h-12 flex-1 border border-asphalt-500 bg-asphalt-800 px-4 text-lg text-bone uppercase placeholder:normal-case placeholder:text-bone-faint focus:border-go-500"
            />
            <button
              type="submit"
              disabled={state.status === "loading"}
              className="inline-flex min-h-12 items-center justify-center bg-go-500 px-8 text-sm font-semibold tracking-wide text-asphalt-950 uppercase transition-colors hover:bg-go-400 disabled:cursor-wait disabled:opacity-60"
            >
              {state.status === "loading" ? "Checking…" : "Check postcode"}
            </button>
          </div>

          {/* Status region — announced to screen readers */}
          <div id={`${inputId}-status`} ref={statusRef} role="status" aria-live="polite" className="mt-6">
            {state.status === "invalid" && (
              <p className="border-l-2 border-red-400 bg-asphalt-800 p-4 text-sm text-red-300">
                That doesn’t look like a UK postcode. Please check it and try again, for example
                SK1 3XE or M20 2RN.
              </p>
            )}

            {state.status === "done" && state.result.covered && (
              <div className="border-l-2 border-go-500 bg-asphalt-800 p-5">
                <p className="font-medium text-go-400">
                  Your postcode is within our usual service area. Continue below to request a
                  lesson.
                </p>
                <p className="mt-2 text-xs text-bone-faint">
                  We’ve added {state.result.normalised} to the booking form for you.
                </p>
              </div>
            )}

            {state.status === "done" && !state.result.covered && (
              <div className="border-l-2 border-bone-faint bg-asphalt-800 p-5">
                <p className="font-medium text-bone">
                  We may still be able to help. Contact GO to confirm instructor availability near
                  you.
                </p>
              </div>
            )}

            {state.status === "done" && (
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="#book"
                  className="inline-flex min-h-11 items-center bg-go-500 px-6 py-2.5 text-sm font-semibold text-asphalt-950 uppercase hover:bg-go-400"
                >
                  Book a lesson
                </a>
                <a
                  href="tel:+447988753966"
                  className="inline-flex min-h-11 items-center border border-bone-faint px-6 py-2.5 text-sm font-semibold text-bone uppercase hover:border-go-500 hover:text-go-400"
                >
                  Call 07988 753 966
                </a>
                <a
                  href="sms:+447988753966?body=GO"
                  className="inline-flex min-h-11 items-center border border-bone-faint px-6 py-2.5 text-sm font-semibold text-bone uppercase hover:border-go-500 hover:text-go-400"
                >
                  Text GO for a callback
                </a>
              </div>
            )}
          </div>
        </form>

        <p className="mt-8 text-xs leading-relaxed text-bone-faint">
          Coverage depends on instructor availability. A postcode within our usual service area
          does not guarantee a specific lesson time.
        </p>
      </div>
    </section>
  );
}
