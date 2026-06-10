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

    // 1. Preload Images
    const preloadImages = () => {
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        imagesRef.current.push(img);
      }
    };
    preloadImages();

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
      const img = imagesRef.current[index];
      
      if (img && img.complete && img.naturalHeight !== 0) {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        context.fillRect(0, 0, canvas.width, canvas.height); // Black background
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
      } else if (img) {
        // If image not yet loaded, draw when it loads
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
        backgroundColor: "#000",
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
      {/* Dark overlay to make it blend with the site */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 20%, rgba(10,10,10,0) 80%, rgba(10,10,10,1) 100%)",
        pointerEvents: "none",
        zIndex: 1
      }}></div>
    </section>
  );
};
