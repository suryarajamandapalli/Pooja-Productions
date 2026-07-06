import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [clicked, setClicked] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lock scroll on mount
  useEffect(() => {
    const preventScroll = (e: Event) => e.preventDefault();
    const preventKeys = (e: KeyboardEvent) => {
      const keys = ["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "End", "Home"];
      if (keys.includes(e.code)) e.preventDefault();
    };

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, []);

  // Canvas drawing loop
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;

    // Handle high-DPI scaling
    const scale = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      ctx.scale(scale, scale);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Temp buffer canvas for pixel operations
    const bufferCanvas = document.createElement("canvas");
    const bufferCtx = bufferCanvas.getContext("2d");

    const renderLoop = () => {
      if (!video || !canvas || !ctx || !bufferCtx) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Draw frames when video is loaded and either playing or ready
      if (video.readyState >= 2) {
        bufferCanvas.width = video.videoWidth;
        bufferCanvas.height = video.videoHeight;
        
        // Draw video frame to buffer
        bufferCtx.drawImage(video, 0, 0);

        // Read buffer pixel values
        const frameData = bufferCtx.getImageData(0, 0, video.videoWidth, video.videoHeight);
        const data = frameData.data;
        const len = data.length;

        // Key out black color in the curtain video
        // Thresholds: pixels with max brightness < 16 are transparent, > 48 are opaque.
        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Max value represents the brightness of the pixel
          const brightness = Math.max(r, g, b);

          if (brightness < 16) {
            data[i + 3] = 0; // fully transparent background
          } else if (brightness < 48) {
            const factor = (brightness - 16) / 32;
            data[i + 3] = Math.round(factor * 255); // smooth alpha transition edge
          }
        }

        // Put frame data to buffer canvas
        bufferCtx.putImageData(frameData, 0, 0);

        // Draw buffer canvas back to viewport canvas stretched to fill screen (object-fit: cover equivalent)
        ctx.clearRect(0, 0, w, h);
        
        // Stretched cover rendering
        const videoRatio = video.videoWidth / video.videoHeight;
        const canvasRatio = w / h;
        let drawW = w;
        let drawH = h;
        let drawX = 0;
        let drawY = 0;

        if (canvasRatio > videoRatio) {
          drawH = w / videoRatio;
          drawY = (h - drawH) / 2;
        } else {
          drawW = h * videoRatio;
          drawX = (w - drawW) / 2;
        }

        ctx.drawImage(bufferCanvas, drawX, drawY, drawW, drawH);
      }

      animFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animFrameId);
    };
  }, [videoLoaded]);

  // Handle clicking the gold Launch button
  const handleLaunchClick = () => {
    if (clicked) return;
    setClicked(true);

    const video = videoRef.current;
    if (!video) return;

    // First unlock video element playback on touch thread
    video.play().then(() => {
      video.pause();
      video.currentTime = 0;

      // Animate homepage reveal filters on root document element
      gsap.set(document.documentElement, {
        "--launch-blur": "25px",
        "--launch-brightness": "0.15"
      });

      const videoDuration = video.duration || 4.2;

      // Scrub video.currentTime using GSAP to achieve velvet curtains opening physics!
      // power2.inOut provides heavy velvet start inertia, fast middle transition, and slow settle deceleration.
      gsap.to(video, {
        currentTime: videoDuration,
        duration: videoDuration,
        ease: "power2.inOut",
        onComplete: () => {
          // Complete transition and navigate home
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: onLaunched
          });
        }
      });

      // Synchronized reveal timeline of the homepage container
      gsap.to(document.documentElement, {
        "--launch-blur": "0px",
        "--launch-brightness": "1.0",
        duration: videoDuration * 0.9,
        ease: "power2.inOut",
        delay: 0.15
      });
    }).catch((err) => {
      console.warn("Video activation failure:", err);
    });
  };

  const handleLoadedData = () => {
    setVideoLoaded(true);
  };

  return (
    <div ref={containerRef} className="new-launch-container">
      {/* Volumetric Gold Cinema Spotlight Aura behind Curtains */}
      <div className="launch-aura"></div>
      <div className="launch-spotlight"></div>

      {/* Screen Canvas where keyed curtains are drawn */}
      <canvas ref={canvasRef} className="launch-curtain-canvas" />

      {/* Centered Golden Theatre ticket button */}
      {!clicked && (
        <div className="launch-btn-wrapper">
          <button className="launch-gold-ticket" onClick={handleLaunchClick}>
            <div className="ticket-notch notch-l"></div>
            <div className="ticket-notch notch-r"></div>
            
            <div className="ticket-inner-border"></div>
            
            <div className="ticket-title">POOJA PRODUCTIONS</div>
            <span className="ticket-action">LAUNCH</span>
            <div className="ticket-meta">ADMIT ONE</div>
          </button>
        </div>
      )}

      {/* Video Element (Hidden in DOM, used as canvas frame source) */}
      <video
        ref={videoRef}
        src="/launch_video.mp4"
        onLoadedData={handleLoadedData}
        className="launch-video-source"
        preload="auto"
        muted
        playsInline
      />
    </div>
  );
};
