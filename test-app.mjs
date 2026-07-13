import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  
  try {
    const buttons = await page.$$('button');
    let startBtn;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.toLowerCase().includes('start challenge')) {
        startBtn = btn;
        break;
      }
    }
    
    if (startBtn) {
      await page.evaluate(el => el.click(), startBtn);
      
      await page.waitForSelector('input[placeholder="e.g. Jane Doe"]', { timeout: 5000 });
      await page.type('input[placeholder="e.g. Jane Doe"]', 'John Smith2');
      await page.type('input[placeholder="e.g. EMP123"]', 'EMP999');
      
      const regButtons = await page.$$('button');
      let regBtn;
      for (const btn of regButtons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.toLowerCase().includes('begin challenge')) {
          regBtn = btn;
          break;
        }
      }
      
      if (regBtn) {
        await page.evaluate(el => el.click(), regBtn);
        await new Promise(r => setTimeout(r, 2000));
        console.log('Current URL after register:', page.url());
        
        // Let's win 1st round
        const word = "STANDARD SETTER";
        for (const char of "TANDRE".split('')) {
          const kButtons = await page.$$('button');
          for (const btn of kButtons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text === char) {
              await page.evaluate(el => el.click(), btn);
              await new Promise(r => setTimeout(r, 200));
            }
          }
        }
        
        await new Promise(r => setTimeout(r, 1000));
        let nextBtn = (await page.$$('button')).pop();
        await page.evaluate(el => el.click(), nextBtn);
        await new Promise(r => setTimeout(r, 1000));
        console.log('Current URL after round 1:', page.url());
      }
    }
  } catch (err) {
    console.error('Interaction error:', err);
  }
  
  await browser.close();
})();
