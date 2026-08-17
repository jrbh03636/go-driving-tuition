import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "domcontentloaded" });
// Capture partway through the load-in animation (before the wipe at 1.7s)
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: "assets/screenshots/extra-preloader.png" });
console.log("shot preloader");
await browser.close();
