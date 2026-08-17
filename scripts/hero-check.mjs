import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});

// Desktop hero
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 4000));
  await page.screenshot({ path: "assets/screenshots/check-desktop-top.png" });

  // Scroll down to check nav solidifies + back-to-top appears
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: "assets/screenshots/check-desktop-scrolled.png" });
  await page.close();
}

// Mobile hero
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 4000));
  await page.screenshot({ path: "assets/screenshots/check-mobile-top.png" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log("mobile overflow px:", overflow);
  await page.close();
}

// Reduced motion
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: "assets/screenshots/check-reduced-motion.png" });
  await page.close();
}

await browser.close();
