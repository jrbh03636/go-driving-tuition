import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(process.env.BASE_URL || "http://localhost:5173", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 4500));
const shots = [
  ["#top-hero", "start", "hero-social"],
];
for (const [sel, block, name] of shots) {
  await page.evaluate((s, b) => {
    const el = s === "last-aside"
      ? Array.from(document.querySelectorAll("aside[aria-label='Recent passes']")).pop()
      : document.querySelector(s);
    if (!el) return;
    if (b === "journey") window.scrollTo({ top: el.offsetTop + window.innerHeight * 2.4, behavior: "instant" });
    else el.scrollIntoView({ behavior: "instant", block: b });
  }, sel, block);
  await new Promise((r) => setTimeout(r, 3500));
  await page.screenshot({ path: `assets/screenshots/extra-${name}.png` });
  console.log("shot", name);
}
await browser.close();
