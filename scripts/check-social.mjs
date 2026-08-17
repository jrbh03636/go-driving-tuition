import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});
const page = await browser.newPage();
await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 2500));
const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a[aria-label*="Facebook"], a[aria-label*="Instagram"]')).map((a) => ({
    label: a.getAttribute("aria-label"),
    href: a.getAttribute("href"),
    target: a.getAttribute("target"),
    rel: a.getAttribute("rel"),
  }))
);
console.log(JSON.stringify(links, null, 2));
await browser.close();
