import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--mute-audio"],
});

// Desktop: front faces, then hover each card to confirm the flip.
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 3000));
  await page.evaluate(() => document.querySelector("#cars")?.scrollIntoView({ behavior: "instant", block: "start" }));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: "assets/screenshots/cars-front.png" });

  const buttons = await page.$$("#cars figure button");
  console.log("fleet cards found:", buttons.length);
  for (let i = 0; i < buttons.length; i++) {
    const box = await buttons[i].boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await new Promise((r) => setTimeout(r, 900)); // let the 700ms flip transition finish
    await page.screenshot({ path: `assets/screenshots/cars-flip-${i}.png` });
  }
  // Move mouse away, confirm it un-flips
  await page.mouse.move(50, 50);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: "assets/screenshots/cars-unflip.png" });
  await page.close();
}

// Mobile: tap to flip (click, since :hover doesn't apply)
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(process.env.BASE_URL || "http://localhost:3000", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 3000));
  await page.evaluate(() => document.querySelector("#cars")?.scrollIntoView({ behavior: "instant", block: "start" }));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: "assets/screenshots/cars-mobile-front.png" });
  await page.click("#cars figure button");
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: "assets/screenshots/cars-mobile-flipped.png" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log("mobile overflow px:", overflow);
  await page.close();
}

await browser.close();
