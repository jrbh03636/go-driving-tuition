---
name: uk-website-compliance-audit
description: Audit this site's code and content against UK legal requirements for business websites — UK GDPR/Data Protection Act 2018, PECR cookie law, Ecommerce Regulations 2002 + Companies Act 2006 trader-disclosure rules, WCAG 2.2 AA / Equality Act 2010 accessibility, Consumer Rights Act 2015 terms & cancellation clarity, and Consumer Protection from Unfair Trading Regulations 2008 (misleading claims). Use whenever asked to check legal compliance, "is my site GDPR compliant", "do I need a cookie banner", "audit my privacy policy", "is this legally OK to publish", "check my terms and conditions", "am I covered legally", or before a UK small-business site goes live/gets new forms, tracking scripts, or pricing claims added. This is a legal/regulatory audit, distinct from the web-design-guidelines skill (which is pure UX/interface quality) — run this one whenever the concern is "will this get us in trouble" rather than "does this look good".
---

# UK Website Compliance Audit

A UK small-business site carries real legal exposure even when the business itself is tiny: the
ICO, trading standards, and the Equality Act don't have a small-business exemption for most of
this. The goal here isn't to lawyer the site into a corporate compliance program — it's to catch
the specific, well-known gaps that these kinds of marketing/booking sites actually get tripped up
on, and hand back concrete fixes with file references, not a wall of legal theory.

## Workflow

1. **Map the site.** Find the footer, any privacy policy / terms content, all forms that collect
   personal data, and anything that loads third-party scripts (analytics, fonts, embeds, chat
   widgets, payment providers). Grep is usually faster than reading every component:
   - `Grep` for `privacy`, `cookie`, `terms`, `GDPR` (case-insensitive) to find existing policy
     content and where it lives.
   - `Grep` for `<form`, `onSubmit`, `useState.*[Ff]ield` to find every data-collecting form.
   - `Grep` for `analytics`, `gtag`, `fbq`, `<script`, `fonts.googleapis`, `import.*from ["']@vercel/analytics` etc. to find third-party scripts and where they're loaded from.
   - Read the footer/header components fully — trader-disclosure info usually either lives there
     or is missing entirely.
2. **Check each domain below.** For each of the six areas, note a status (`✅ compliant`,
   `⚠️ partial / at risk`, `❌ missing`) and cite the exact file/line for both what's present and
   what's missing. Don't guess at content you haven't actually read — open the privacy policy,
   terms, and forms in full rather than inferring from filenames.
3. **Distinguish "not legally required" from "missing".** Not every site needs every mechanism —
   e.g. a site with zero non-essential cookies genuinely doesn't need a cookie banner. Say so
   explicitly rather than flagging its absence as a gap. The point is accuracy, not maximum
   findings.
4. **Report using the format below.** Lead with the things that create real exposure (unlawful
   data collection, misleading pricing, no trader ID) before minor polish items (missing alt text
   on a decorative icon).

Read `references/checklist.md` for the full domain-by-domain checklist — what "compliant" actually
looks like for each of the six areas, and how to check it against React/Vite code specifically.
It's organized so you can jump straight to the domain you're auditing rather than reading it
linearly.

## Report format

Use this structure. Keep findings terse and cite `file:line` wherever the audit tool result gives
you one — that's what makes the report actionable instead of a legal essay.

```markdown
# UK Compliance Audit — [site name]

## Summary
[2-3 sentences: overall posture, and the 1-3 things that matter most]

## 1. UK GDPR / Data Protection Act 2018 — [status]
**Present:** ...
**Missing / at risk:** ...
**Fix:** ...

## 2. PECR / Cookie law — [status]
...

## 3. Trader disclosure (Ecommerce Regs 2002 + Companies Act 2006) — [status]
...

## 4. Accessibility (WCAG 2.2 AA / Equality Act 2010) — [status]
...

## 5. Terms & conditions / Consumer Rights Act 2015 — [status]
...

## 6. Misleading claims (CPUT Regs 2008) — [status]
...

## Priority fix list
1. [highest-exposure item, with file reference]
2. ...
```

If the user asks to *fix* the findings rather than just report them, treat that as a separate,
explicit follow-up — implement fixes the same way you would any other code change (read the file
before editing, keep the site's existing design language, don't invent new UI patterns when an
existing one already fits).

## Scope reminder

This produces a practical engineering-level audit, not legal advice — say so if the user seems to
be treating the output as a substitute for a solicitor's sign-off on anything high-stakes (e.g.
sector-specific licensing, DBS-related disclosures for a driving instruction business, or
insurance terms). The six areas above cover the general "any UK business website" baseline.
