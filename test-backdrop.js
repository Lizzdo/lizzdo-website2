import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  await page.goto('http://localhost:3000/store/sci-fi-modular-corridors', { waitUntil: 'networkidle0' });
  
  // open lightbox
  await page.evaluate(() => document.querySelector('.group.cursor-pointer').click());
  await new Promise(r => setTimeout(r, 1000));
  
  // try to click backdrop (just below the image, or the far left edge)
  console.log("Clicking backdrop at 10, 10...");
  await page.mouse.click(10, 10); // Far top-left
  
  await new Promise(r => setTimeout(r, 1000));
  
  const isLightboxStillThere = await page.evaluate(() => {
    return document.querySelector('.fixed.inset-0.z-\\[100\\]') !== null;
  });
  
  console.log("Is lightbox still there after mouse click?", isLightboxStillThere);
  
  await browser.close();
})();
