import React, { useEffect, useRef, useState } from "react";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [clicked, setClicked] = useState(false);
  const [firstFrameDrawn, setFirstFrameDrawn] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

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

  // Set up canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const video = videoRef.current;
      if (video && video.paused && video.currentTime === 0) {
        drawFrame(video, canvas);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Frame processing helper
  const drawFrame = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Offscreen buffer canvas for pixel operations
    const bufferCanvas = document.createElement("canvas");
    const bufferCtx = bufferCanvas.getContext("2d");
    if (!bufferCtx) return;

    bufferCanvas.width = video.videoWidth || 960;
    bufferCanvas.height = video.videoHeight || 540;

    // Draw video frame to buffer
    bufferCtx.drawImage(video, 0, 0, bufferCanvas.width, bufferCanvas.height);

    const frameData = bufferCtx.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);
    const data = frameData.data;
    const len = data.length;

    // Key out black color in the curtain video
    // Thresholds: pixels with max brightness < 16 are transparent, > 48 are opaque.
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const brightness = Math.max(r, g, b);

      if (brightness < 16) {
        data[i + 3] = 0; // transparent
      } else if (brightness < 48) {
        const factor = (brightness - 16) / 32;
        data[i + 3] = Math.round(factor * 255); // smooth alpha blend edge
      }
    }

    bufferCtx.putImageData(frameData, 0, 0);

    // Cover scale drawing (similar to object-fit: cover)
    ctx.clearRect(0, 0, w, h);

    const videoRatio = bufferCanvas.width / bufferCanvas.height;
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
  };

  // Video data loaded trigger first frame draw
  const handleLoadedData = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      video.currentTime = 0;
      drawFrame(video, canvas);
      setFirstFrameDrawn(true);
    }
  };

  // Play animation loop
  const startAnimation = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const updateFrame = () => {
      if (!video.paused && !video.ended) {
        drawFrame(video, canvas);
      }
      animationFrameId.current = requestAnimationFrame(updateFrame);
    };

    video.play().then(() => {
      animationFrameId.current = requestAnimationFrame(updateFrame);
    }).catch((err) => {
      console.warn("Video playback blocked or failed:", err);
    });
  };

  // Video ended callback
  const handleVideoEnded = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    onLaunched(); // unmounts LaunchPage
  };

  const handleLaunchClick = () => {
    if (clicked) return;
    setClicked(true);
    startAnimation();
  };

  return (
    <div className="new-launch-container">
      {/* Fullscreen keying canvas for video frames */}
      <canvas ref={canvasRef} className="launch-canvas-layer" />

      {/* Heavy Gold Launch switch button */}
      {!clicked && firstFrameDrawn && (
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

      {/* Video Element */}
      <video
        ref={videoRef}
        src="/launch_video.mp4"
        onLoadedData={handleLoadedData}
        onEnded={handleVideoEnded}
        className="launch-video-element"
        preload="auto"
        muted
        playsInline
      />
    </div>
  );
};
