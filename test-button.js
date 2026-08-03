import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  await page.goto('http://localhost:3000/store/sci-fi-modular-corridors', { waitUntil: 'networkidle0' });
  
  // open lightbox
  await page.evaluate(() => document.querySelector('.group.cursor-pointer').click());
  await new Promise(r => setTimeout(r, 1000));
  
  // print button styles
  const buttonInfo = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (let b of buttons) {
      if (b.innerHTML.includes('lucide-x')) {
        const style = window.getComputedStyle(b);
        return {
          display: style.display,
          visibility: style.visibility,
          width: style.width,
          height: style.height,
          position: style.position,
          top: style.top,
          right: style.right,
          zIndex: style.zIndex,
          pointerEvents: style.pointerEvents,
          opacity: style.opacity
        };
      }
    }
    return null;
  });
  
  console.log("Button styles:", buttonInfo);
  await browser.close();
})();
