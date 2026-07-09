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
  
  console.log("Waiting 2 seconds for initial animations...");
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Click welcome popup to close it
  console.log("Closing welcome popup...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a"));
    const closeBtn = buttons.find(b => b.textContent.includes("Enter Site") || b.textContent.includes("Explore Our Films"));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Get scroll position and rock transform BEFORE scroll
  const beforeScroll = await page.evaluate(() => {
    const container = document.querySelector(".about-rock-user");
    const style = window.getComputedStyle(container);
    const rect = container.getBoundingClientRect();
    return {
      scroll: window.scrollY,
      transform: style.transform,
      rect: { y: rect.y, height: rect.height }
    };
  });
  console.log("Before Scroll:", beforeScroll);

  // Scroll to about section
  console.log("Scrolling to #about...");
  await page.evaluate(() => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView();
  });
  
  // Wait for Lenis smooth scroll and ScrollTrigger to settle
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get scroll position and rock transform AFTER scroll
  const afterScroll = await page.evaluate(() => {
    const section = document.getElementById("about");
    const container = document.querySelector(".about-rock-user");
    const img = container ? container.querySelector("img") : null;
    
    if (!section || !container || !img) {
      return { error: "Elements not found after scroll" };
    }
    
    const secRect = section.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    const secStyle = window.getComputedStyle(section);
    const contStyle = window.getComputedStyle(container);
    
    return {
      scroll: window.scrollY,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
      section: {
        rect: { y: secRect.y, height: secRect.height },
        overflow: secStyle.overflow
      },
      container: {
        transform: contStyle.transform,
        rect: { y: contRect.y, height: contRect.height }
      },
      img: {
        rect: { y: imgRect.y, height: imgRect.height }
      }
    };
  });
  console.log("After Scroll:", afterScroll);
  
  await browser.close();
}

run().catch(console.error);
