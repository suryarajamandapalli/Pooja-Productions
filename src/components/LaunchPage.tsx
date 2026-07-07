import React, { useEffect, useRef, useState } from "react";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [clicked, setClicked] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Lock scrolling
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

  // Set up canvas resolution and sizing
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

  const drawFrame = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Fast offscreen canvas
    if (!bufferCanvasRef.current) {
      bufferCanvasRef.current = document.createElement("canvas");
    }
    const bufferCanvas = bufferCanvasRef.current;
    bufferCanvas.width = 960;
    bufferCanvas.height = 540;
    
    const bufferCtx = bufferCanvas.getContext("2d");
    if (!bufferCtx) return;

    // Draw frame to buffer (stretched cover)
    const vw = video.videoWidth || 960;
    const vh = video.videoHeight || 540;
    const vr = vw / vh;
    const tr = 960 / 540;

    let sx = 0, sy = 0, sw = vw, sh = vh;
    if (vr > tr) {
      sw = vh * tr;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / tr;
      sy = (vh - sh) / 2;
    }

    bufferCtx.drawImage(video, sx, sy, sw, sh, 0, 0, 960, 540);

    const frame = bufferCtx.getImageData(0, 0, 960, 540);
    const data = frame.data;
    const len = data.length;

    // Key out ONLY pure/near-black background pixels (r, g, b all below 14)
    // Preserves red curtain folds and fabric shadows perfectly
    const threshold = 14;
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r < threshold && g < threshold && b < threshold) {
        data[i + 3] = 0; // Transparent
      }
    }

    bufferCtx.putImageData(frame, 0, 0);

    // Draw buffer to visible screen canvas (object-fit: cover equivalent)
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(bufferCanvas, 0, 0, w, h);
  };

  const handleVideoLoad = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      drawFrame(video, canvas);
      setVideoReady(true);
    }
  };

  const startAnimation = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    console.log("startAnimation triggered");
    console.log("1. video.paused:", video.paused);
    console.log("2. video.readyState:", video.readyState);
    console.log("3. video.currentTime before play:", video.currentTime);

    const renderLoop = () => {
      if (video && !video.ended) {
        drawFrame(video, canvas);
        console.log("Render frame at video.currentTime:", video.currentTime, "paused:", video.paused);
        animationFrameId.current = requestAnimationFrame(renderLoop);
      } else {
        console.log("renderLoop exit, video.ended:", video?.ended);
      }
    };

    try {
      await video.play();
      console.log("video.play() resolved successfully. video.paused:", video.paused);
      animationFrameId.current = requestAnimationFrame(renderLoop);
    } catch (err) {
      console.error("video.play() failed with error:", err);
      // Fallback: unmount and show site immediately so page isn't blocked on failure
      onLaunched();
    }
  };

  const handleVideoEnded = () => {
    console.log("Video ended event fired");
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    // Instantly remove everything
    onLaunched();
  };

  const handleLaunchClick = () => {
    if (clicked || !videoReady) return;
    setClicked(true);
    startAnimation();
  };

  // Pre-load check on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      console.log("handleReady readyState:", video.readyState);
      if (video.readyState === 4 && !videoReady) {
        handleVideoLoad();
      }
    };

    video.addEventListener("canplaythrough", handleReady);
    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("progress", handleReady);

    // Fallback: poll readyState every 200ms to ensure it updates immediately if cached
    const interval = setInterval(() => {
      if (video.readyState === 4 && !videoReady) {
        console.log("Polling fallback detected readyState === 4");
        handleReady();
        clearInterval(interval);
      }
    }, 200);

    // Initial check
    if (video.readyState === 4) {
      handleReady();
    }

    return () => {
      video.removeEventListener("canplaythrough", handleReady);
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("progress", handleReady);
      clearInterval(interval);
    };
  }, [videoReady]);

  return (
    <div className="launch-stage-overlay">
      <canvas ref={canvasRef} className="launch-stage-canvas" />

      {!clicked && (
        <div className="launch-btn-container">
          <button
            className="launch-gold-btn"
            onClick={handleLaunchClick}
            disabled={!videoReady}
          >
            LAUNCH
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        src="/launch_video.mp4"
        onEnded={handleVideoEnded}
        className="launch-video-hidden"
        preload="auto"
        muted
        playsInline
      />
    </div>
  );
};
