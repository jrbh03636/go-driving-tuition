import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 2500));
const offenders = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const bad = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      bad.push({
        tag: el.tagName,
        cls: (el.className.baseVal ?? el.className ?? "").toString().slice(0, 80),
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
      });
    }
  });
  return { vw, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 12) };
});
console.log(JSON.stringify(offenders, null, 1));
await browser.close();
