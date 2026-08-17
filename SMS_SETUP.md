# Contact form → instructor SMS setup

The booking form POSTs its data as JSON to a webhook URL, which triggers an
SMS to the instructor. No server of your own is needed — the "backend" is a
free Make.com automation that calls ClickSend.

If the webhook isn't configured yet (or a submission fails to send), the form
automatically falls back to opening a pre-filled email, so nothing is ever
lost while you're setting this up.

## 1. ClickSend (sends the actual text)

1. Sign up at clicksend.com (free trial credit, 14 days).
2. Verify your email address — required before you can send real messages.
3. Get your API credentials: on the Home dashboard, open the **API
   Credentials** panel (or **Account → API Credentials** from the account
   menu). Note your **API Username** and **API Key** — you'll paste these
   into Make in step 2.
4. Optional but recommended: set up a proper alphanumeric **Sender ID**
   (e.g. "GODriving") under **Sender IDs** in the left nav, so texts arrive
   looking like they're from the business rather than a generic shared
   number. One-way notification sender IDs are usually approved quickly.
5. Keep an eye on your balance — the trial gives a small amount of credit;
   after that, ClickSend is pay-as-you-go per SMS (top up as needed, no
   subscription required).

## 2. Make.com (the automation / webhook)

1. Sign up free at make.com.
2. Create a new **Scenario**.
3. Add module: **Webhooks → Custom webhook** → give it a name (e.g. "GO
   Driving Tuition enquiry") → Save. Make shows you a webhook URL — copy it,
   you'll need it in step 3.
4. Submit one test entry from the form (step 3 first, then come back) or
   click **Redetermine data structure** and send a sample payload, so Make
   learns the field names: `name`, `email`, `phone`, `postcode`,
   `lessonType`, `transmission`, `experience`, `days`, `times`, `message`,
   `submittedAt`.
5. Add a second module: search for **ClickSend → Send SMS** (sometimes
   listed as "Send a Text Message"). Connect your ClickSend account using
   the API Username + API Key from step 1. Set:
   - **From / Sender ID**: your ClickSend Sender ID (or leave as the shared
     default while testing)
   - **To**: the instructor's mobile number (typed in directly, since every
     enquiry currently goes to the one instructor)
   - **Message**: this is what's actually configured on the live scenario —
     ```
     New enquiry: {{name}} ({{phone}}) - {{postcode}} - {{lessonType}}. {{message}}
     Days: {{join(days; ", ")}} Times: {{join(times; ", ")}}
     ```
     `days` and `times` arrive as arrays (a learner can pick more than one),
     so `join(...; ", ")` turns them into a readable comma-separated list —
     e.g. "Days: Monday, Wednesday Times: Evening".
6. Optional but recommended: add a **Filter** between the two modules that
   only continues if `name` and `phone` are non-empty, as basic spam
   protection.
7. Turn the scenario **ON** (top-left toggle).

## 3. Connect it to the website

1. In the project folder, copy `.env.example` to a new file `.env.local`.
2. Set:
   ```
   VITE_CONTACT_WEBHOOK_URL=<the Make webhook URL from step 2.3>
   ```
3. Restart `npm run dev` (or rebuild with `npm run build` for production) so
   Vite picks up the new environment variable.
4. `.env.local` is already listed in `.gitignore`, so the URL won't end up in
   your git history.

## 4. Test it

1. Submit the form on the site with test details.
2. Confirm the instructor's phone receives the text within a few seconds.
3. If it doesn't arrive, open the scenario in Make and check the **History**
   tab — it shows exactly what was received and where it failed (e.g.
   ClickSend rejecting an unverified Sender ID, or insufficient credit).

## Notes

- **Cost**: Make's free plan includes 1,000 operations/month. Each enquiry
  uses about 2 (webhook + SMS), so roughly 500 enquiries/month before you'd
  need a paid Make plan. ClickSend charges per SMS sent (a few pence each,
  pay-as-you-go — no monthly number rental like Twilio).
- **Abuse**: because there's no login, the webhook URL is a public endpoint —
  anyone who inspects the page's network traffic could find it and submit to
  it directly. The form has a honeypot field to deter simple bots, and the
  optional Make filter in step 2.6 adds a second layer. Keeping a modest
  ClickSend balance (rather than a large pre-top-up) limits the damage from
  a genuine abuse burst.
- **Adding more instructors later**: swap the single hardcoded "To" number in
  the ClickSend module for a **Router** module in Make that branches on a
  field (e.g. area or a dropdown added to the form), each branch texting a
  different instructor.
