import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 834, height: 1194 }); // iPad Air portrait
await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 4000));
await page.screenshot({ path: "assets/screenshots/tablet-01-hero.png" });

const sections = ["#about", "#lessons", "#pricing", "#cars", "#coverage", "#book"];
for (const sel of sections) {
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ behavior: "instant", block: "start" }), sel);
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: `assets/screenshots/tablet-${sel.replace("#", "")}.png` });
}
await browser.close();
