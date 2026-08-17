import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 2000));
await page.evaluate(() => document.querySelector("#cars")?.scrollIntoView({ behavior: "instant", block: "start" }));
// Wait for the three fleet photos to actually finish loading (not just be in the DOM).
await page.waitForFunction(
  () => {
    const imgs = Array.from(document.querySelectorAll("#cars figure img"));
    return imgs.length === 3 && imgs.every((img) => img.complete && img.naturalWidth > 0);
  },
  { timeout: 15000 }
);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: "assets/screenshots/cars-after-delete.png" });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("overflow px:", overflow);
await browser.close();
