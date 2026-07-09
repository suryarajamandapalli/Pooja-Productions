import puppeteer from "puppeteer";

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log("Navigating to http://localhost:5173/...");
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle2" });
  
  console.log("Waiting for preloader to finish...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Close welcome popup
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a"));
    const closeBtn = buttons.find(b => b.textContent.includes("Enter Site") || b.textContent.includes("Explore Our Films"));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Find scroll range of #about section
  const aboutInfo = await page.evaluate(() => {
    const el = document.getElementById("about");
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      height: rect.height,
      windowHeight: window.innerHeight
    };
  });
  
  console.log("About Section scroll position info:", aboutInfo);
  
  // Scroll from above #about to below #about in steps of 100px
  const startScroll = aboutInfo.top - 800;
  const endScroll = aboutInfo.top + aboutInfo.height + 200;
  
  console.log(`Scrolling from ${startScroll} to ${endScroll}...`);
  
  for (let s = startScroll; s <= endScroll; s += 200) {
    await page.evaluate((scrollPos) => {
      window.scrollTo(0, scrollPos);
    }, s);
    
    // Wait for scroll updates to process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const status = await page.evaluate(() => {
      const leftRock = document.querySelector(".about-rock-left");
      const rightRock = document.querySelector(".about-rock-right");
      return {
        currentScroll: window.scrollY,
        leftTransform: leftRock ? window.getComputedStyle(leftRock).transform : "not found",
        rightTransform: rightRock ? window.getComputedStyle(rightRock).transform : "not found"
      };
    });
    
    console.log(`Scroll: ${status.currentScroll} | Left Rock: ${status.leftTransform} | Right Rock: ${status.rightTransform}`);
  }
  
  await browser.close();
}

run().catch(console.error);
