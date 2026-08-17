# Compliance checklist by domain

Each section: what the law actually requires (in practical terms), what "compliant" looks like on
a typical React/Vite marketing+booking site, and how to check it in this kind of codebase.

## 1. UK GDPR / Data Protection Act 2018

**Requires:** anywhere the site collects personal data (name, email, phone, postcode, IP via forms
or analytics), there must be a privacy notice covering: what's collected, why (lawful basis),
retention period, who it's shared with, and how someone exercises their rights (access, rectification,
erasure, objection) plus the route to complain to the ICO. Consent isn't required for every use —
"legitimate interest" and "contract" are valid lawful bases for responding to enquiries and
delivering a service someone's already bought — but the notice must *say* which basis applies and
it must actually be true.

**Check:**
- Find the privacy policy content (often a component like `PrivacyPolicy.tsx` or a static page).
  Read it in full — don't assume a policy that exists is complete.
- Cross-reference every field in every form against what the privacy policy claims to collect. A
  form collecting a field the policy doesn't mention (or vice versa — a policy describing data the
  site doesn't actually take) is a real finding, not pedantry.
- Check the lawful basis stated is plausible for what's actually happening (enquiry form →
  legitimate interest/contract is fine; a marketing newsletter signup needs consent, not
  legitimate interest).
- Check retention periods are stated, not vague ("as long as necessary" without a number is weak
  but not automatically non-compliant; a stated period like "12 months" is stronger and easier to
  audit against actual practice).
- Contact details for data-rights requests must be real and reachable — an actual email/address,
  not just "contact us".

## 2. PECR / Cookie law

**Requires:** the Privacy and Electronic Communications Regulations govern cookies *and* any
similar client-side storage/tracking (localStorage used for tracking, tracking pixels, etc.) —
not just literal cookies. Strictly necessary cookies (session state, security, a shopping cart)
don't need consent. Anything else — analytics, ad pixels, embedded video that sets tracking
cookies, font/script CDNs that log requests in an identifying way — needs *prior* opt-in consent
before it loads, with a genuine "reject" option that's as easy as "accept".

**Check:**
- Grep for anything that loads a third party at runtime: analytics SDKs (`@vercel/analytics`,
  `gtag`, `fbq`, GA), embedded maps/video, external font loaders, chat widgets, payment widgets.
- For each one found, determine: does it set cookies or use fingerprinting-adjacent techniques, and
  does it load before any consent mechanism? Read the library's own privacy docs if unsure —
  e.g. Vercel Web Analytics is cookie-less and privacy-preserving by design, which is a legitimate
  reason a "we don't use cookies" claim can be accurate; Google Analytics is not cookie-less by
  default.
- If the privacy/cookie policy makes a claim ("we don't use cookies", "no tracking"), verify it
  against what's actually loaded in the built site, not just what the source implies — check
  `index.html`, any `<script>` tags, and third-party imports.
- If non-essential tracking *is* present with no consent banner, that's the headline finding for
  this section — it's the most commonly-enforced PECR gap on small sites.

## 3. Trader disclosure — Ecommerce Regulations 2002 + Companies Act 2006

**Requires:** any UK business trading online must make easily and directly accessible: the trader's
name, geographic address (not a PO box only), and an email address enabling quick contact. If it's
a registered company, also the company registration number, place of registration, and registered
office address if different from the trading address. Sole traders don't need a company number but
still need name + address + contact.

**Check:**
- Read the footer/header/contact/about components. Confirm: business/trading name, a real
  geographic address, and a working contact email are all present and not buried behind a form-only
  contact page.
- If the privacy policy states an address (common, since it's needed there too), check the same
  address also appears somewhere a visitor would find it *without* reading the privacy policy —
  the requirement is about the general site, not just the legal pages.
- Determine if the business is a limited company (check footer copy, "Ltd" in the name, or ask if
  unclear) — if so, flag if the company number is missing; if it's a sole trader or partnership,
  this sub-item doesn't apply and should be marked not-applicable rather than missing.

## 4. Accessibility — WCAG 2.2 AA / Equality Act 2010

**Requires:** UK service providers (this includes small businesses, not just public bodies) have
duties under the Equality Act 2010 to make reasonable adjustments for disabled users, and WCAG 2.2
AA is the practical industry benchmark for what "accessible" means for a website. This is a big
topic on its own — here, check the baseline items that are cheap to get right and commonly missed,
not a full WCAG audit (point to the `web-design-guidelines` skill for the deeper UX/interface
pass if the user wants that level of detail).

**Check:**
- Every meaningful `<img>` has a real `alt`; decorative images/icons have `alt=""` or
  `aria-hidden="true"`, not a missing attribute.
- Every form `<input>`/`<select>`/`<textarea>` has an associated `<label>` (via `htmlFor`/`id` or
  wrapping) — not just a placeholder standing in for a label.
- Colour isn't the only signal for state (errors, required fields, selected options) — check for
  text/icon alongside colour, not colour alone.
- Interactive elements are reachable and operable by keyboard — custom buttons/toggles built from
  `<div>`s with `onClick` and no `role`/`tabIndex`/keyboard handler are a common miss; native
  `<button>`/`<a>` elements get this for free.
- Focus states are visible (not suppressed with `outline: none` and no replacement).
- Check contrast for body text against its background is at least 4.5:1 (3:1 for large text) —
  spot-check the site's actual colour tokens (e.g. a Tailwind `@theme` block or CSS custom
  properties) rather than eyeballing screenshots.

## 5. Terms & conditions / Consumer Rights Act 2015

**Requires:** if the site sells a service to consumers, terms should exist and be findable, and
must not attempt to exclude rights the Consumer Rights Act 2015 makes non-excludable (e.g. the
right to a service performed with reasonable care and skill). Cancellation/refund terms specifically
get scrutinised — they must be clear, not hidden, and can't be unfairly one-sided (e.g. the business
can cancel penalty-free but the customer can't, with no justification).

**Check:**
- Locate the terms & conditions content and read it in full.
- Check cancellation/refund terms are present, state a clear notice period, and are symmetric
  enough to survive scrutiny — a clause that lets the business cancel with less notice or fewer
  consequences than it demands from the customer is the most common issue here, though for
  professional services (like driving lessons) a customer-notice requirement matched with a
  legitimate service-postponement clause for the business is standard and fine, not automatically
  unfair.
- Check nothing in the terms tries to disclaim statutory rights outright ("no refunds under any
  circumstances" is the classic red flag).
- Confirm the terms are actually reachable from the site (footer link, not just something that
  exists in the codebase but isn't rendered/linked anywhere).

## 6. Misleading claims — Consumer Protection from Unfair Trading Regulations 2008

**Requires:** advertising claims must be accurate and substantiable — pricing, statistics, guarantees,
and comparisons in particular. This isn't about being conservative in marketing copy; it's about the
claim being true and not misleading by omission.

**Check:**
- For every quantitative claim on the site (pass rates, "X years experience", "X students taught",
  pricing, "cheapest"/"best" comparisons), check whether it's presented as a bald fact or
  appropriately qualified, and flag anything that reads as unverifiable/invented rather than the
  business's own genuine figures — you can't verify the *truth* of a business's stats, but you can
  flag ones that look like placeholder or stock-copy numbers worth the owner double-checking.
- Check pricing pages/copy state whether prices include VAT (or that the business isn't
  VAT-registered), and whether any "from £X" framing is honestly the typical price, not a
  cherry-picked minimum that most customers won't actually pay.
- Check any "guarantee" language is something the business can and does actually stand behind, not
  aspirational marketing copy dressed as a guarantee.
