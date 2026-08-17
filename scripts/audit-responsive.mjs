import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-834", width: 834, height: 1194 },
  { name: "tablet-1024", width: 1024, height: 1366 },
];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height });
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 3500)); // preloader + initial reveals

  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = Math.round(vp.height * 0.85);
  const allOffenders = new Map();
  let maxScrollWidth = 0;

  for (let y = 0; y <= pageHeight; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await new Promise((r) => setTimeout(r, 1100)); // let reveal/parallax animations settle

    const { scrollW, offenders } = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const found = [];
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        // Only check elements actually on screen right now (a real user would see this).
        if (r.width <= 0 || r.bottom < -20 || r.top > vh + 20) return;
        if (r.right > vw + 3 || r.left < -3) {
          found.push({
            tag: el.tagName,
            id: el.id || null,
            cls: (typeof el.className === "string" ? el.className : "").slice(0, 100),
            left: Math.round(r.left),
            right: Math.round(r.right),
            width: Math.round(r.width),
          });
        }
      });
      return { scrollW: document.documentElement.scrollWidth, offenders: found };
    });

    maxScrollWidth = Math.max(maxScrollWidth, scrollW);
    for (const o of offenders) {
      const key = o.tag + "|" + o.cls;
      if (!allOffenders.has(key)) allOffenders.set(key, { ...o, scrollY: y });
    }
  }

  const vw = vp.width;
  console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);
  console.log("max scrollWidth vs viewport:", maxScrollWidth, "/", vw);
  const list = [...allOffenders.values()];
  if (list.length) {
    console.log(`${list.length} real (in-viewport) offenders:`);
    console.log(JSON.stringify(list, null, 1));
  } else {
    console.log("no in-viewport overflow found");
  }

  await page.close();
}

await browser.close();
console.log("\ndone");
