import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 4500));

const opacityOfFirstStripFigure = () =>
  page.evaluate(() => {
    const fig = document.querySelector("aside[aria-label='Recent passes'] figure");
    if (!fig) return null;
    return { opacity: getComputedStyle(fig).opacity, visibility: getComputedStyle(fig).visibility };
  });

// 1. Scroll to the strip so it reveals
await page.evaluate(() => {
  document.querySelector("aside[aria-label='Recent passes']")?.scrollIntoView({ behavior: "instant", block: "center" });
});
await new Promise((r) => setTimeout(r, 1800));
console.log("after reveal:", JSON.stringify(await opacityOfFirstStripFigure()));

// 2. Scroll back to the very top
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 1200));
console.log("scrolled to top:", JSON.stringify(await opacityOfFirstStripFigure()));

// 3. Return to the strip — it must still be fully visible immediately
await page.evaluate(() => {
  document.querySelector("aside[aria-label='Recent passes']")?.scrollIntoView({ behavior: "instant", block: "center" });
});
await new Promise((r) => setTimeout(r, 300));
console.log("back at strip:", JSON.stringify(await opacityOfFirstStripFigure()));

await browser.close();
