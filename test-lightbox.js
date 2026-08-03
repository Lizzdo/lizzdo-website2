import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:3000/store/sci-fi-modular-corridors', { waitUntil: 'networkidle0' });
  
  console.log("Clicking the first image to open lightbox...");
  await page.evaluate(() => {
    document.querySelector('.group.cursor-pointer').click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("Clicking the close button in lightbox...");
  await page.evaluate(() => {
    // try to find the close button, it should have the X icon
    const buttons = document.querySelectorAll('button');
    for (let b of buttons) {
      if (b.innerHTML.includes('lucide-x')) {
        console.log('Found close button! Clicking...');
        b.click();
      }
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  const isLightboxStillThere = await page.evaluate(() => {
    return document.querySelector('.fixed.inset-0.z-\\[100\\]') !== null;
  });
  
  console.log("Is lightbox still there?", isLightboxStillThere);
  
  await browser.close();
})();
