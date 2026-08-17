import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { parsePostcode } from "../lib/postcodes";

/**
 * Booking enquiry form.
 *
 * ── BACKEND INTEGRATION ────────────────────────────────────────────────
 * On submit, validated data is POSTed as JSON to the webhook URL in
 * VITE_CONTACT_WEBHOOK_URL (set in a local .env.local file — see
 * .env.example). That webhook is a Make.com scenario which texts the
 * instructor via Twilio. See SMS_SETUP.md for how to configure it.
 *
 * If VITE_CONTACT_WEBHOOK_URL isn't set, or the request fails, the form
 * falls back to a pre-filled mailto: link to ar@go-drivingtuition.com so
 * an enquiry is never silently lost.
 * ──────────────────────────────────────────────────────────────────────
 */

interface BookingFormProps {
  /** Postcode carried over from the coverage checker. */
  postcode: string;
  onPostcodeChange: (v: string) => void;
}

interface Fields {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  transmission: string;
  experience: string;
  days: string[];
  times: string[];
  message: string;
  consent: boolean;
}

type Errors = Partial<Record<keyof Fields, string>>;

// All GO cars are manual, so transmission is fixed rather than chosen.
const EXPERIENCE = [
  "Complete beginner",
  "Some lessons before",
  "Test booked",
  "Full licence, refresher",
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["Morning", "Afternoon", "Evening"];

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = "Please enter your full name.";
  if (!f.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    errors.email = "Please enter a valid email address, e.g. name@example.com.";
  }
  if (!f.phone.trim()) {
    errors.phone = "Please enter your telephone number.";
  } else if (!/^[+\d][\d\s()-]{8,}$/.test(f.phone.trim())) {
    errors.phone = "Please enter a valid telephone number.";
  }
  if (!f.postcode.trim()) {
    errors.postcode = "Please enter your postcode.";
  } else if (!parsePostcode(f.postcode)) {
    errors.postcode = "Please enter a valid UK postcode, e.g. SK1 3XE.";
  }
  if (!f.days.length) errors.days = "Please select at least one available day.";
  if (!f.times.length) errors.times = "Please select at least one available time.";
  if (!f.consent) errors.consent = "Please confirm you’re happy for us to contact you.";
  return errors;
}

function buildMailto(f: Fields): string {
  const subject = `Lesson enquiry (${f.postcode.toUpperCase()})`;
  const body = [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Telephone: ${f.phone}`,
    `Postcode: ${f.postcode.toUpperCase()}`,
    `Transmission: ${f.transmission || "No preference given"}`,
    `Experience: ${f.experience || "Not stated"}`,
    `Preferred days: ${f.days.length ? f.days.join(", ") : "Not stated"}`,
    `Preferred times: ${f.times.length ? f.times.join(", ") : "Not stated"}`,
    "",
    f.message || "",
  ].join("\n");
  return `mailto:ar@go-drivingtuition.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function BookingForm({ postcode, onPostcodeChange }: BookingFormProps) {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    transmission: "Manual",
    experience: "",
    days: [],
    times: [],
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [mailtoUrl, setMailtoUrl] = useState<string | null>(null); // fallback link
  const [hp, setHp] = useState(""); // honeypot — real users never fill this in
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Carry the postcode over from the checker (editable afterwards).
  useEffect(() => {
    if (postcode) {
      setFields((f) => ({ ...f, postcode }));
    }
  }, [postcode]);

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
    setStatus("idle");
    setMailtoUrl(null);
  }

  function toggleList(key: "days" | "times", value: string) {
    setFields((f) => {
      const list = f[key];
      return {
        ...f,
        [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
      };
    });
    setStatus("idle");
    setMailtoUrl(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStatus("idle");
      setMailtoUrl(null);
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }

    // Bots tend to fill every field, including ones hidden from real users.
    if (hp) return;

    const webhookUrl = import.meta.env.VITE_CONTACT_WEBHOOK_URL as string | undefined;

    if (!webhookUrl) {
      setMailtoUrl(buildMailto(fields));
      setStatus("idle");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: fields.phone,
          postcode: fields.postcode.toUpperCase(),
          transmission: fields.transmission,
          experience: fields.experience,
          days: fields.days,
          times: fields.times,
          message: fields.message,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Webhook responded with ${res.status}`);
      setStatus("sent");
    } catch {
      // Something went wrong reaching the webhook — don't lose the enquiry.
      setStatus("error");
      setMailtoUrl(buildMailto(fields));
    }
  }

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} className="mt-1.5 text-sm text-red-300">
        {errors[key]}
      </p>
    ) : null;

  const describedBy = (key: keyof Fields) => (errors[key] ? `${uid}-${key}-error` : undefined);

  const inputCls =
    "min-h-12 w-full border border-asphalt-500 bg-asphalt-800 px-4 py-3 text-bone placeholder:text-bone-faint focus:border-go-500";
  const legendCls = "text-sm font-medium text-bone";

  return (
    <section id="book" aria-label="Book a lesson" className="bg-asphalt-900 px-6 py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        <div data-reveal>
          <p className="text-sm tracking-[0.35em] uppercase text-go-500">Get started</p>
        <h2 className="display mt-4 text-4xl text-bone md:text-6xl">Book a lesson</h2>
        <p className="mt-6 leading-relaxed text-bone-dim">
          Complete the form to contact us about learning to drive and booking lessons with GO
          Driving Tuition. If you prefer to speak to our friendly team,{" "}
          <a href="tel:+447988753966" className="text-go-400 underline underline-offset-4">
            call us directly
          </a>{" "}
          or text <strong className="text-bone">‘GO’</strong> for a free callback.
        </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-12 space-y-8">
          {/* Honeypot — hidden from real visitors, catches simple bots. */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor={`${uid}-website`}>Leave this field blank</label>
            <input
              id={`${uid}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <div
              ref={errorSummaryRef}
              tabIndex={-1}
              role="alert"
              className="border-l-2 border-red-400 bg-asphalt-800 p-4 text-sm text-red-300"
            >
              Please correct the highlighted fields below.
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-name`} className={legendCls}>
                Full name <span aria-hidden="true">*</span>
              </label>
              <input
                id={`${uid}-name`}
                className={inputCls + " mt-2"}
                autoComplete="name"
                value={fields.name}
                onChange={(e) => set("name", e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={describedBy("name")}
              />
              {err("name")}
            </div>
            <div>
              <label htmlFor={`${uid}-email`} className={legendCls}>
                Email address <span aria-hidden="true">*</span>
              </label>
              <input
                id={`${uid}-email`}
                type="email"
                className={inputCls + " mt-2"}
                autoComplete="email"
                value={fields.email}
                onChange={(e) => set("email", e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={describedBy("email")}
              />
              {err("email")}
            </div>
            <div>
              <label htmlFor={`${uid}-phone`} className={legendCls}>
                Telephone number <span aria-hidden="true">*</span>
              </label>
              <input
                id={`${uid}-phone`}
                type="tel"
                className={inputCls + " mt-2"}
                autoComplete="tel"
                value={fields.phone}
                onChange={(e) => set("phone", e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.phone}
                aria-describedby={describedBy("phone")}
              />
              {err("phone")}
            </div>
            <div>
              <label htmlFor={`${uid}-postcode`} className={legendCls}>
                Postcode <span aria-hidden="true">*</span>
              </label>
              <input
                id={`${uid}-postcode`}
                className={inputCls + " mt-2 uppercase"}
                autoComplete="postal-code"
                value={fields.postcode}
                onChange={(e) => {
                  set("postcode", e.target.value);
                  onPostcodeChange(e.target.value);
                }}
                aria-required="true"
                aria-invalid={!!errors.postcode}
                aria-describedby={describedBy("postcode")}
              />
              {err("postcode")}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-experience`} className={legendCls}>
                Current driving experience
              </label>
              <select
                id={`${uid}-experience`}
                className={inputCls + " mt-2"}
                value={fields.experience}
                onChange={(e) => set("experience", e.target.value)}
              >
                <option value="">Choose…</option>
                {EXPERIENCE.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${uid}-transmission`} className={legendCls}>
                Transmission
              </label>
              <div
                id={`${uid}-transmission`}
                className={inputCls + " mt-2 flex items-center justify-between text-bone"}
              >
                <span>Manual</span>
                <span className="text-xs text-bone-faint">All GO cars are manual</span>
              </div>
            </div>
          </div>

          <fieldset aria-required="true" aria-invalid={!!errors.days} aria-describedby={describedBy("days")}>
            <legend className={legendCls}>
              Days available <span aria-hidden="true">*</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <label
                  key={d}
                  className={`inline-flex min-h-11 cursor-pointer items-center border px-4 py-2 text-sm transition-colors ${
                    fields.days.includes(d)
                      ? "border-go-500 bg-go-900 text-go-400"
                      : "border-asphalt-500 text-bone-dim hover:border-bone-faint"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={fields.days.includes(d)}
                    onChange={() => toggleList("days", d)}
                  />
                  {d}
                </label>
              ))}
            </div>
            {err("days")}
          </fieldset>

          <fieldset aria-required="true" aria-invalid={!!errors.times} aria-describedby={describedBy("times")}>
            <legend className={legendCls}>
              Times available <span aria-hidden="true">*</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {TIMES.map((t) => (
                <label
                  key={t}
                  className={`inline-flex min-h-11 cursor-pointer items-center border px-4 py-2 text-sm transition-colors ${
                    fields.times.includes(t)
                      ? "border-go-500 bg-go-900 text-go-400"
                      : "border-asphalt-500 text-bone-dim hover:border-bone-faint"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={fields.times.includes(t)}
                    onChange={() => toggleList("times", t)}
                  />
                  {t}
                </label>
              ))}
            </div>
            {err("times")}
          </fieldset>

          <div>
            <label htmlFor={`${uid}-message`} className={legendCls}>
              Message
            </label>
            <textarea
              id={`${uid}-message`}
              rows={5}
              className={inputCls + " mt-2 resize-y"}
              placeholder="Anything you’d like us to know: availability, nerves, previous experience…"
              value={fields.message}
              onChange={(e) => set("message", e.target.value)}
            />
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-go-500"
                checked={fields.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-required="true"
                aria-invalid={!!errors.consent}
                aria-describedby={describedBy("consent")}
              />
              <span className="text-sm text-bone-dim">
                I’m happy for GO Driving Tuition to contact me about my enquiry by phone, text or
                email, in line with our{" "}
                <a
                  href="#privacy-policy"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new Event("open-privacy-policy"));
                  }}
                  className="text-bone underline underline-offset-4 hover:text-go-400"
                >
                  Privacy Policy
                </a>
                . <span aria-hidden="true">*</span>
              </span>
            </label>
            {err("consent")}
          </div>

          <div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex min-h-12 w-full items-center justify-center bg-go-500 px-10 py-3 text-sm font-bold tracking-widest text-asphalt-950 uppercase transition-colors hover:bg-go-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "sending" ? "Sending…" : "Send enquiry"}
            </button>

            {status === "sent" && (
              <div role="status" aria-live="polite" className="mt-6 border-l-2 border-go-500 bg-asphalt-800 p-5">
                <p className="text-bone">
                  Thanks, your enquiry has been sent and an instructor will be in touch shortly.
                </p>
                <p className="mt-3 text-xs text-bone-faint">
                  Need to speak to someone now? Call{" "}
                  <a href="tel:+447988753966" className="underline">
                    07988 753 966
                  </a>{" "}
                  or text ‘GO’ for a free callback.
                </p>
              </div>
            )}

            {mailtoUrl && status !== "sent" && (
              <div role="status" aria-live="polite" className="mt-6 border-l-2 border-go-500 bg-asphalt-800 p-5">
                <p className="text-bone">
                  {status === "error"
                    ? "Sorry, we couldn’t send that automatically. Your enquiry is ready below instead."
                    : "Your enquiry is ready. The button below opens a pre-filled email in your mail app, just press send."}
                </p>
                <a
                  href={mailtoUrl}
                  className="mt-4 inline-flex min-h-11 items-center bg-go-500 px-6 py-2.5 text-sm font-semibold text-asphalt-950 uppercase hover:bg-go-400"
                >
                  Open pre-filled email
                </a>
                <p className="mt-3 text-xs text-bone-faint">
                  Prefer not to email? Call{" "}
                  <a href="tel:+447988753966" className="underline">
                    07988 753 966
                  </a>{" "}
                  or text ‘GO’ for a free callback.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
