import puppeteer from "puppeteer-core";

const url = process.argv[2];
const name = process.argv[3] || "peek";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
try {
  await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
} catch {
  console.log("load timeout — continuing with what rendered");
}
await new Promise((r) => setTimeout(r, 6000));
const S = "C:\\Users\\refle\\AppData\\Local\\Temp\\claude\\C--Users-refle-Claude-Website\\886776a0-7e37-417f-b856-5fb55d0af6f3\\scratchpad";
await page.screenshot({ path: `${S}\\${name}-1.png` });
// scroll a few viewports and capture
for (let i = 2; i <= 4; i++) {
  await page.evaluate(() => window.scrollBy({ top: window.innerHeight * 1.6, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: `${S}\\${name}-${i}.png` });
}
const text = await page.evaluate(() => document.body.innerText.slice(0, 1500));
console.log("TEXT:", text.replace(/\n+/g, " | ").slice(0, 800));
await browser.close();
