import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [clicked, setClicked] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Lock scroll on mount and set initial subtle 2px blur
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

    // Maximum 2px blur on homepage content before launch
    gsap.set(document.documentElement, {
      "--launch-blur": "2px"
    });

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, []);

  // Frame processing helper with fixed 960x540 internal resolution for maximum performance
  const drawFrame = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetWidth = 960;
    const targetHeight = 540;

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    if (!bufferCanvasRef.current) {
      bufferCanvasRef.current = document.createElement("canvas");
    }
    const bufferCanvas = bufferCanvasRef.current;
    bufferCanvas.width = targetWidth;
    bufferCanvas.height = targetHeight;

    const bufferCtx = bufferCanvas.getContext("2d");
    if (!bufferCtx) return;

    // Calculate crop coordinates for object-fit: cover
    const videoWidth = video.videoWidth || 960;
    const videoHeight = video.videoHeight || 540;
    const videoRatio = videoWidth / videoHeight;
    const targetRatio = targetWidth / targetHeight;

    let sx = 0, sy = 0, sw = videoWidth, sh = videoHeight;

    if (videoRatio > targetRatio) {
      sw = videoHeight * targetRatio;
      sx = (videoWidth - sw) / 2;
    } else {
      sh = videoWidth / targetRatio;
      sy = (videoHeight - sh) / 2;
    }

    bufferCtx.drawImage(video, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);

    const frameData = bufferCtx.getImageData(0, 0, targetWidth, targetHeight);
    const data = frameData.data;
    const len = data.length;

    // Key out black background pixels
    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const brightness = Math.max(r, g, b);

      if (brightness < 16) {
        data[i + 3] = 0; // transparent
      } else if (brightness < 48) {
        const factor = (brightness - 16) / 32;
        data[i + 3] = Math.round(factor * 255); // smooth transparent edge transition
      }
    }

    bufferCtx.putImageData(frameData, 0, 0);

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(bufferCanvas, 0, 0);
  };

  // Video data loaded trigger first frame draw and ready state check
  const handleReadyCheck = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState === 4) {
      video.currentTime = 0;
      drawFrame(video, canvas);
      setIsReady(true);
    }
  };

  // Handle clicking the gold Launch switch button
  const handleLaunchClick = () => {
    if (clicked || !isReady) return;
    setClicked(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Play click button depress state for 300ms, then start video curtains reveal
    setTimeout(() => {
      const renderLoop = () => {
        if (!video.paused && !video.ended) {
          drawFrame(video, canvas);
          animationFrameId.current = requestAnimationFrame(renderLoop);
        }
      };

      // Play video forward exactly ONE time
      video.play().then(() => {
        animationFrameId.current = requestAnimationFrame(renderLoop);
        
        // Gradually decrease blur from 2px to 0px over the duration of the curtain opening
        gsap.to(document.documentElement, {
          "--launch-blur": "0px",
          duration: video.duration || 4.5,
          ease: "power1.inOut"
        });
      }).catch((err) => {
        console.warn("Curtains video play error:", err);
      });
    }, 300);
  };

  // Video ended callback
  const handleVideoEnded = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      video.pause();
      // Draw last frame once to freeze it
      drawFrame(video, canvas);
    }

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Freeze final frame for exactly 200ms before destroying the overlay
    setTimeout(() => {
      onLaunched(); // unmounts LaunchPage
    }, 200);
  };

  // Pre-load check on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (video.readyState === 4) {
        handleReadyCheck();
      } else {
        video.addEventListener("canplaythrough", handleReadyCheck);
        video.addEventListener("loadeddata", handleReadyCheck);
      }
    }
    return () => {
      if (video) {
        video.removeEventListener("canplaythrough", handleReadyCheck);
        video.removeEventListener("loadeddata", handleReadyCheck);
      }
    };
  }, []);

  return (
    <div className="new-launch-container">
      {/* Fullscreen keying canvas for video frames */}
      <canvas ref={canvasRef} className="launch-canvas-layer" />

      {/* Heavy Gold Launch switch button */}
      {!clicked && (
        <div className="launch-btn-wrapper">
          <button
            className="launch-gold-ticket"
            onClick={handleLaunchClick}
            disabled={!isReady}
          >
            <div className="ticket-notch notch-l"></div>
            <div className="ticket-notch notch-r"></div>
            <div className="ticket-inner-border"></div>
            <div className="ticket-title">POOJA PRODUCTIONS</div>
            <span className="ticket-action">{isReady ? "LAUNCH" : "BUFFERING"}</span>
            <div className="ticket-meta">ADMIT ONE</div>
          </button>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src="/launch_video.mp4"
        onEnded={handleVideoEnded}
        className="launch-video-element"
        preload="auto"
        muted
        playsInline
      />
    </div>
  );
};
