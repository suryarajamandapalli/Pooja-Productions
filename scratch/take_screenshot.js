import puppeteer from "puppeteer";
import path from "path";

const artifactDir = "C:\\Users\\surya\\.gemini\\antigravity\\brain\\58fc329b-fe14-401d-9f4e-32195b2485bb";

async function takeScreenshot(width, height, name) {
  console.log(`Launching browser for ${name} (${width}x${height})...`);
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  
  console.log("Navigating to http://localhost:5173/#about...");
  await page.goto("http://localhost:5173/#about", { waitUntil: "networkidle2" });
  
  console.log("Waiting 3 seconds for animations and loading...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Close welcome popup if present
  console.log("Closing welcome popup...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button, a"));
    const closeBtn = buttons.find(b => b.textContent.includes("Enter Site") || b.textContent.includes("Explore Our Films"));
    if (closeBtn) {
      closeBtn.click();
    } else {
      // Fallback: click backdrop to close
      const backdrop = document.querySelector("div[style*='position: fixed'][style*='z-index: 99999']");
      if (backdrop) backdrop.click();
    }
  });

  // Wait 1 second for close animation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Scroll to about section to make sure it's loaded and triggered by GSAP if needed
  await page.evaluate(() => {
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView();
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const screenshotPath = path.join(artifactDir, `screenshot_${name}.png`);
  console.log(`Saving screenshot to ${screenshotPath}...`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  await browser.close();
}

async function run() {
  await takeScreenshot(1440, 900, "desktop");
  await takeScreenshot(1024, 768, "tablet");
  await takeScreenshot(480, 800, "mobile");
  console.log("Screenshots done.");
}

run().catch(console.error);
