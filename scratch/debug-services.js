import * as puppeteer from 'puppeteer-core';
import * as chromeLauncher from 'chrome-launcher';
import axios from 'axios';

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const response = await axios.get(`http://127.0.0.1:${chrome.port}/json/version`);
  const { webSocketDebuggerUrl } = response.data;

  const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  const servicesData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.stack-item'));
    return cards.map((card, idx) => {
      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      return {
        index: idx,
        height: card.offsetHeight,
        top: rect.top,
        bottom: rect.bottom,
        yTransform: style.transform,
        position: style.position,
        display: style.display
      };
    });
  });
  
  console.log('SERVICES CARD HEIGHTS & TRANSFORMS:', servicesData);
  
  await browser.disconnect();
  chrome.kill();
})();
