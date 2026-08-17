import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});

for (const width of [375, 768]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 4000));

  for (const sel of ["#about figure img", "#coverage figure svg"]) {
    await page.evaluate((s) => {
      document.querySelector(s)?.scrollIntoView({ behavior: "instant", block: "center" });
    }, sel);
    await new Promise((r) => setTimeout(r, 2500)); // generous settle time
    const box = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), vw: document.documentElement.clientWidth };
    }, sel);
    console.log(`width=${width} ${sel}:`, JSON.stringify(box));
  }
  await page.close();
}

await browser.close();
