import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  
  await page.goto('http://localhost:3000/store/sci-fi-modular-corridors', { waitUntil: 'networkidle0' });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // open lightbox
  await page.evaluate(() => document.querySelector('.group.cursor-pointer').click());
  await new Promise(r => setTimeout(r, 1000));
  
  // Attach a click listener to document to see what we actually clicked!
  await page.evaluate(() => {
    document.addEventListener('click', (e) => {
      console.log('Clicked element:', e.target.tagName, e.target.className);
    });
  });
  
  console.log("Clicking backdrop at 10, 10...");
  await page.mouse.click(10, 10);
  
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
