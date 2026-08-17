import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});

const WIDTHS = [1280, 1440, 1920];
const SECTIONS = ["#top-hero", "#about", "#lessons", "#pricing", "#cars", "#coverage", "#book"];

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 4000));

  // Overflow + scroll-drift check
  const before = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollLeft: document.body.scrollLeft,
  }));

  // Exercise the booking form fields like a desktop user tabbing through
  await page.evaluate(() => document.querySelector("#book")?.scrollIntoView({ behavior: "instant", block: "start" }));
  await new Promise((r) => setTimeout(r, 800));
  const fieldSelectors = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#book input, #book select, #book textarea")).map((el, i) => {
      el.setAttribute("data-audit-index", String(i));
      return `[data-audit-index="${i}"]`;
    })
  );
  for (const sel of fieldSelectors) {
    await page.focus(sel).catch(() => {});
    await new Promise((r) => setTimeout(r, 60));
  }

  const after = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollLeft: document.body.scrollLeft,
  }));

  console.log(`\n=== desktop ${width}px ===`);
  console.log("before form interaction:", JSON.stringify(before));
  console.log("after tabbing through form:", JSON.stringify(after));

  await page.screenshot({ path: `assets/screenshots/desktop-check-${width}-hero.png` });
  for (const sel of SECTIONS) {
    await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ behavior: "instant", block: "start" }), sel);
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `assets/screenshots/desktop-check-${width}-${sel.replace("#", "")}.png` });
  }
  await page.close();
}

await browser.close();
console.log("\ndone");
