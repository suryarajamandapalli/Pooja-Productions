import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 208;

const currentFrame = (index: number) => 
  `BG FRAMES/ezgif-frame-${index.toString().padStart(3, "0")}.png`;

export const CinematicSequence: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    const container = containerRef.current;
    if (!canvas || !context || !container) return;

    // 1. Progressive on-demand image frame loader
    imagesRef.current = new Array(FRAME_COUNT);

    const loadFrame = (index: number): HTMLImageElement => {
      const idx = Math.max(0, Math.min(index, FRAME_COUNT - 1));
      if (!imagesRef.current[idx]) {
        const img = new Image();
        img.src = currentFrame(idx + 1);
        imagesRef.current[idx] = img;
      }
      return imagesRef.current[idx];
    };

    // Preload initial 12 frames immediately for instant rendering
    for (let i = 0; i < 12; i++) {
      loadFrame(i);
    }

    // Progressively background-load subsequent frames in chunks during idle time
    let backgroundLoaderId: any;
    let nextChunk = 12;
    const scheduleNextChunk = () => {
      if (nextChunk >= FRAME_COUNT) return;
      const end = Math.min(nextChunk + 10, FRAME_COUNT);
      for (let i = nextChunk; i < end; i++) {
        loadFrame(i);
      }
      nextChunk = end;
      if (nextChunk < FRAME_COUNT) {
        backgroundLoaderId = setTimeout(scheduleNextChunk, 150);
      }
    };
    backgroundLoaderId = setTimeout(scheduleNextChunk, 800);

    // Helper to draw image cover
    const drawImageCover = (img: HTMLImageElement) => {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    };

    // 2. Set Canvas Size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(renderFrameRef.current);
    };

    // 3. Object-fit cover drawing logic
    const render = (index: number) => {
      renderFrameRef.current = index;
      if (!canvas || !context) return;
      
      // Lookahead preload window around current scrub frame
      const windowStart = Math.max(0, index - 5);
      const windowEnd = Math.min(FRAME_COUNT - 1, index + 15);
      for (let w = windowStart; w <= windowEnd; w++) {
        loadFrame(w);
      }

      const img = loadFrame(index);
      if (img && img.complete && img.naturalHeight !== 0) {
        drawImageCover(img);
      } else if (img) {
        // Find nearest loaded frame to avoid any black flicker
        let fallbackImg: HTMLImageElement | null = null;
        for (let step = 1; step <= 20; step++) {
          const prev = imagesRef.current[index - step];
          if (prev && prev.complete && prev.naturalHeight !== 0) {
            fallbackImg = prev;
            break;
          }
          const next = imagesRef.current[index + step];
          if (next && next.complete && next.naturalHeight !== 0) {
            fallbackImg = next;
            break;
          }
        }
        if (fallbackImg) {
          drawImageCover(fallbackImg);
        }
        img.onload = () => {
          if (renderFrameRef.current === index) {
            render(index);
          }
        };
      }
    };

    // Initial render of first frame
    setTimeout(() => {
      resizeCanvas();
      render(0);
    }, 100);

    window.addEventListener("resize", resizeCanvas);

    // 4. GSAP ScrollTrigger Sequence
    const frameObj = { frame: 0 };
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=400%", // 400vh of scrolling
        pin: true,
        scrub: 0.5, // Smooth scrubbing
      }
    });

    // Animate the frame object
    tl.to(frameObj, {
      frame: FRAME_COUNT - 1,
      snap: "frame",
      ease: "none",
      duration: FRAME_COUNT,
      onUpdate: () => requestAnimationFrame(() => render(Math.round(frameObj.frame)))
    }, 0);

    // Ensure all other scroll animations refresh their positions now that we've added a pinned spacer
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(backgroundLoaderId);
      window.removeEventListener("resize", resizeCanvas);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{ 
        position: "relative", 
        width: "100%", 
        height: "100vh", 
        overflow: "hidden",
        backgroundColor: "#141414",
        zIndex: 5 // sits below sticky header but above background
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%",
          zIndex: 0
        }} 
      />
      {/* Dark overlay to blend top/bottom with the site */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "linear-gradient(to bottom, #141414 0%, rgba(20,20,20,0) 18%, rgba(20,20,20,0) 70%, rgba(20,20,20,0.6) 85%, #141414 100%)",
        pointerEvents: "none",
        zIndex: 1
      }}></div>
    </section>
  );
};
