import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  await page.goto('http://localhost:3000/store/sci-fi-modular-corridors', { waitUntil: 'networkidle0' });
  
  // open lightbox
  await page.evaluate(() => document.querySelector('.group.cursor-pointer').click());
  await new Promise(r => setTimeout(r, 1000));
  
  // try to click close button via mouse coordinates
  const rect = await page.evaluate(() => {
    const lightbox = document.querySelector('.fixed.inset-0.z-\\[100\\]');
    if (!lightbox) return null;
    const buttons = lightbox.querySelectorAll('button');
    for (let b of buttons) {
      if (b.innerHTML.includes('lucide-x')) {
        const r = b.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      }
    }
    return null;
  });
  
  if (rect) {
    console.log("Found close button at", rect);
    await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2);
  } else {
    console.log("No close button found");
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  const isLightboxStillThere = await page.evaluate(() => {
    return document.querySelector('.fixed.inset-0.z-\\[100\\]') !== null;
  });
  
  console.log("Is lightbox still there after mouse click?", isLightboxStillThere);
  
  await browser.close();
})();
