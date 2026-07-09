import puppeteer from "puppeteer";

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  
  // Set viewport to a typical desktop size
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log("Navigating to http://localhost:5173/#about...");
  await page.goto("http://localhost:5173/#about", { waitUntil: "networkidle2" });
  
  console.log("Waiting 2 seconds for animations...");
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log("Evaluating rock element properties...");
  const data = await page.evaluate(() => {
    const section = document.getElementById("about");
    const container = document.querySelector(".about-rock-user-container");
    const img = container ? container.querySelector("img") : null;
    
    if (!section) return { error: "#about section not found" };
    if (!container) return { error: ".about-rock-user-container not found in DOM" };
    if (!img) return { error: "img inside container not found" };
    
    const secRect = section.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    // Check computed styles
    const secStyle = window.getComputedStyle(section);
    const contStyle = window.getComputedStyle(container);
    const imgStyle = window.getComputedStyle(img);
    
    // Check if the image loaded successfully
    const isImgLoaded = img.complete && img.naturalWidth > 0;
    
    return {
      section: {
        id: section.id,
        rect: { x: secRect.x, y: secRect.y, width: secRect.width, height: secRect.height },
        display: secStyle.display,
        visibility: secStyle.visibility,
        opacity: secStyle.opacity
      },
      container: {
        rect: { x: contRect.x, y: contRect.y, width: contRect.width, height: contRect.height },
        display: contStyle.display,
        visibility: contStyle.visibility,
        opacity: contStyle.opacity,
        transform: contStyle.transform
      },
      img: {
        src: img.src,
        rect: { x: imgRect.x, y: imgRect.y, width: imgRect.width, height: imgRect.height },
        display: imgStyle.display,
        visibility: imgStyle.visibility,
        opacity: imgStyle.opacity,
        isLoaded: isImgLoaded,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }
    };
  });
  
  console.log("Result:", JSON.stringify(data, null, 2));
  
  await browser.close();
}

run().catch(console.error);
