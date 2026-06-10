import * as puppeteer from 'puppeteer-core';
import * as chromeLauncher from 'chrome-launcher';
import axios from 'axios';

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const response = await axios.get(`http://127.0.0.1:${chrome.port}/json/version`);
  const { webSocketDebuggerUrl } = response.data;

  const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const loadingOpacities = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.loading__item')).map(el => window.getComputedStyle(el).opacity);
  });
  console.log('LOADING ITEM OPACITIES:', loadingOpacities);
  
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 2000));
  
  const animateInUpOpacities = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.animate-in-up')).map(el => window.getComputedStyle(el).opacity);
  });
  console.log('ANIMATE IN UP OPACITIES:', animateInUpOpacities);

  await browser.disconnect();
  chrome.kill();
})();
