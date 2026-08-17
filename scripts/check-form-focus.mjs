import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 667 }); // small, old-iPhone-style viewport
await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 4000));

await page.evaluate(() => document.querySelector("#book")?.scrollIntoView({ behavior: "instant", block: "start" }));
await new Promise((r) => setTimeout(r, 1000));

// Tap into every text input/select/textarea in the booking form, one after another,
// exactly like a mobile user filling out the form field by field.
const fieldSelectors = await page.evaluate(() =>
  Array.from(document.querySelectorAll("#book input, #book select, #book textarea"))
    .map((el, i) => {
      el.setAttribute("data-audit-index", String(i));
      return `[data-audit-index="${i}"]`;
    })
);
console.log("fields to tap through:", fieldSelectors.length);

for (const sel of fieldSelectors) {
  await page.focus(sel).catch(() => {});
  await new Promise((r) => setTimeout(r, 250));
}
await page.evaluate(() => document.activeElement.blur());
await new Promise((r) => setTimeout(r, 500));

const result = await page.evaluate(() => ({
  bodyScrollLeft: document.body.scrollLeft,
  scrollX: window.scrollX,
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));
console.log("after tapping through every field:", JSON.stringify(result));
await page.screenshot({ path: "assets/screenshots/after-form-tapping.png" });
await browser.close();
