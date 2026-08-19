/**
 * Local postcode-district coverage check for GO Driving Tuition.
 *
 * This is intentionally a plain, local lookup against normalised UK
 * postcode districts — it is NOT connected to a live availability
 * service. To connect a real service later, replace the body of
 * `checkCoverage` with an API call; the rest of the UI already handles
 * loading / success / error states.
 */

/** Usual service area, by outward postcode district. */
const COVERED_DISTRICTS = new Set([
  "SK1", "SK2", "SK3", "SK4", "SK5", "SK7", "SK8", "SK12",
]);

/**
 * Full or outward-only UK postcode format.
 * Accepts e.g. "SK4 2AB", "sk42ab", "M20", "M20 3XY".
 */
const UK_POSTCODE_RE =
  /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})?$/i;

export interface PostcodeResult {
  valid: boolean;
  /** Normalised postcode, e.g. "SK4 2AB" or "M20" */
  normalised: string;
  /** Outward district, e.g. "SK4" */
  district: string;
  covered: boolean;
}

export function parsePostcode(raw: string): PostcodeResult | null {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, " ");
  const compact = cleaned.replace(/\s/g, "");
  // Re-split: inward code is always the last 3 chars of a full postcode.
  const m =
    compact.length > 4
      ? compact.slice(0, -3).match(/^[A-Z]{1,2}\d[A-Z\d]?$/i) &&
        compact.slice(-3).match(/^\d[A-Z]{2}$/i)
        ? ([compact.slice(0, -3), compact.slice(-3)] as const)
        : null
      : UK_POSTCODE_RE.test(compact)
        ? ([compact, ""] as const)
        : null;

  if (!m) return null;

  const outward = m[0].toUpperCase();
  const inward = m[1] ? m[1].toUpperCase() : "";
  // District = letters + first digit group, e.g. "SK4" from "SK4",
  // "M20" from "M20". For districts like "M1A" keep letters+digits.
  const districtMatch = outward.match(/^[A-Z]{1,2}\d{1,2}/);
  if (!districtMatch) return null;
  const district = districtMatch[0];

  return {
    valid: true,
    normalised: inward ? `${outward} ${inward}` : outward,
    district,
    covered: COVERED_DISTRICTS.has(district),
  };
}

/**
 * Integration point for a real availability service.
 * Currently resolves locally after a short delay so the UI's loading
 * state is exercised. Swap the implementation for a fetch() when a
 * backend exists — the return shape can stay the same.
 */
export function checkCoverage(raw: string): Promise<PostcodeResult | null> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(parsePostcode(raw)), 450);
  });
}
