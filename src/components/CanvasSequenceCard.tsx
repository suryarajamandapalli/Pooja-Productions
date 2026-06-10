import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 208;

const currentFrame = (index: number) => 
  `BG FRAMES/ezgif-frame-${index.toString().padStart(3, "0")}.png`;

export const CanvasSequenceCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const text4Ref = useRef<HTMLDivElement>(null);

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
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
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
    // We delay slightly to ensure container has dimensions
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
        start: "center center",
        end: "+=500%", // 500vh of scrolling
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

    // 5. Synchronized Text Overlays
    // Duration is in "frames" based on timeline
    
    // Text 1: HELLO ! (Frames 1-40)
    tl.fromTo(text1Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, 1)
      .to(text1Ref.current, { opacity: 0, y: -20, duration: 10, ease: "power2.in" }, 30);

    // Text 2: Mr. MK Presents (Frames 40-90)
    tl.fromTo(text2Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, 40)
      .to(text2Ref.current, { opacity: 0, y: -20, duration: 10, ease: "power2.in" }, 80);

    // Text 3: POOJA PRODUCTIONS (Frames 90-160)
    tl.fromTo(text3Ref.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 15, ease: "power2.out" }, 90)
      .to(text3Ref.current, { opacity: 0, scale: 1.05, duration: 15, ease: "power2.in" }, 145);

    // Text 4: Crafting Stories That Live Forever (Frames 160-208)
    tl.fromTo(text4Ref.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 15, ease: "power2.out" }, 160);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="divider divider-image animate-in-up"
      style={{ 
        position: "relative", 
        width: "100%", 
        paddingBottom: "60%", // Aspect ratio 
        borderRadius: "var(--_radius-l)", 
        overflow: "hidden",
        backgroundColor: "#000"
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
      
      {/* Dark gradient overlay for text readability */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)", zIndex: 1 }} />

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 2, pointerEvents: "none", padding: "20px" }}>
        
        <div ref={text1Ref} style={{ position: "absolute", opacity: 0, textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0, fontFamily: '"Urbanist", sans-serif' }}>
            HELLO !
          </h2>
        </div>

        <div ref={text2Ref} style={{ position: "absolute", opacity: 0, textAlign: "center" }}>
          <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#e0e0e0", textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 300, fontFamily: '"Urbanist", sans-serif' }}>
            Mr. MK Presents
          </h3>
        </div>

        <div ref={text3Ref} style={{ position: "absolute", opacity: 0, textAlign: "center", width: "100%" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, textShadow: "0 10px 30px rgba(0,0,0,0.5)", fontFamily: '"Urbanist", sans-serif' }}>
            POOJA PRODUCTIONS
          </h1>
        </div>

        <div ref={text4Ref} style={{ position: "absolute", opacity: 0, textAlign: "center" }}>
          <p style={{ fontSize: "clamp(1.2rem, 2.5vw, 2rem)", color: "#d0d0d0", fontStyle: "italic", letterSpacing: "0.05em", fontWeight: 400, fontFamily: '"Urbanist", sans-serif' }}>
            Crafting Stories That Live Forever
          </p>
        </div>

      </div>
    </div>
  );
};
