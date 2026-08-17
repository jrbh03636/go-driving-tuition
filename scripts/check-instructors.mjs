import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});

for (const [label, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 3000));
  await page.evaluate(() => document.querySelector("#instructors")?.scrollIntoView({ behavior: "instant", block: "start" }));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `assets/screenshots/instructors-${label}.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(label, "overflow px:", overflow);
  await page.close();
}
await browser.close();
