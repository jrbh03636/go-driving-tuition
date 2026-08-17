import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new", args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1536, height: 780 });
await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
await new Promise(r => setTimeout(r, 4500));
await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: "assets/screenshots/hero-scrolled.png" });
// report the bounding box of the content block
const box = await page.evaluate(() => {
  const el = document.querySelector("#top-hero > div.relative.z-10");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), vw: window.innerWidth };
});
console.log("content box:", JSON.stringify(box));
await browser.close();
