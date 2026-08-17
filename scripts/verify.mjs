/**
 * Headless verification pass for the GO Driving Tuition site.
 * Drives http://localhost:5173 with system Chrome via puppeteer-core,
 * captures the required screenshots and reports console errors.
 */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.BASE_URL || "http://localhost:5173";
const OUT = "assets/screenshots";
mkdirSync(OUT, { recursive: true });

const consoleErrors = [];

async function settle(page, ms = 900) {
  await new Promise((r) => setTimeout(r, ms));
}

async function scrollTo(page, y) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await settle(page);
}

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("shot:", name);
}

async function runViewport(browser, label, width, height) {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`[${label}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => consoleErrors.push(`[${label}] pageerror: ${err.message}`));
  await page.setViewport({ width, height });
  await page.goto(BASE, { waitUntil: "load", timeout: 60000 });
  // Wait until the opening film has enough data to render frames.
  await page
    .waitForFunction(
      () => {
        const v = document.querySelector("video");
        return !v || v.readyState >= 2;
      },
      { timeout: 30000 }
    )
    .catch(() => console.warn("video never became ready — continuing"));
  // Let the preloader draw + wipe before interacting.
  await settle(page, 4200);

  await shot(page, `${label}-01-hero`);
  await page.evaluate(() => document.querySelector("#about")?.scrollIntoView({ behavior: "instant" }));
  await settle(page, 700);
  await shot(page, `${label}-02-about`);

  // Mid-way through the pinned road journey (drawn road + car + lines)
  await page.evaluate(() => {
    const el = document.querySelector("#about");
    if (el) window.scrollTo({ top: el.offsetTop + window.innerHeight * 1.6, behavior: "instant" });
  });
  await settle(page, 1200);
  await shot(page, `${label}-03-road-journey`);

  const sections = [
    ["#lessons", "06-lessons"],
    ["#pricing", "07-pricing"],
    ["#postcode", "08-postcode"],
    ["#book", "09-booking-form"],
  ];
  for (const [sel, name] of sections) {
    await page.evaluate((s) => {
      document.querySelector(s)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, sel);
    await settle(page, 1400);
    await shot(page, `${label}-${name}`);
  }

  // Exercise the postcode checker end-to-end (desktop run only).
  if (label === "desktop") {
    await page.evaluate(() =>
      document.querySelector("#postcode")?.scrollIntoView({ behavior: "instant" })
    );
    await settle(page, 500);
    await page.type("#postcode input", "sk4 2ab");
    await page.click("#postcode button[type=submit]");
    await settle(page, 1200);
    await shot(page, `${label}-10-postcode-success`);

    const carried = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll("#book input"));
      const pc = inputs.find((i) => i.getAttribute("autocomplete") === "postal-code");
      return pc ? pc.value : null;
    });
    console.log("postcode carried to booking form:", JSON.stringify(carried));

    // Out-of-area postcode
    await page.evaluate(() => {
      const input = document.querySelector("#postcode input");
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      setter.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.type("#postcode input", "OL1 1AA");
    await page.click("#postcode button[type=submit]");
    await settle(page, 1200);
    await shot(page, `${label}-11-postcode-outside`);

    // Booking form validation errors
    await page.evaluate(() =>
      document.querySelector("#book")?.scrollIntoView({ behavior: "instant" })
    );
    await settle(page, 400);
    await page.click("#book button[type=submit]");
    await settle(page, 500);
    await shot(page, `${label}-12-form-errors`);

    const errorCount = await page.evaluate(
      () => document.querySelectorAll("#book [id$='-error']").length
    );
    console.log("form validation errors shown:", errorCount);

    // Horizontal overflow check
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    console.log("horizontal overflow px:", overflow);
  }

  if (label === "mobile") {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    console.log("mobile horizontal overflow px:", overflow);
  }

  await page.close();
}

async function runReducedMotion(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(BASE, { waitUntil: "load", timeout: 60000 });
  await settle(page, 1200);
  await page.screenshot({ path: `${OUT}/reduced-motion-01-top.png` });
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: "instant" }));
  await settle(page, 600);
  await page.screenshot({ path: `${OUT}/reduced-motion-02-static-car.png` });
  console.log("shot: reduced-motion x2");
  await page.close();
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--mute-audio"],
});

try {
  await runViewport(browser, "desktop", 1440, 900);
  await runViewport(browser, "mobile", 390, 844);
  await runReducedMotion(browser);
} finally {
  await browser.close();
}

console.log("\nconsole errors:", consoleErrors.length ? consoleErrors : "none");
