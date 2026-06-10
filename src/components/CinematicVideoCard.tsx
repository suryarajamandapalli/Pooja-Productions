import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const CinematicVideoCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    const setupScrollTrigger = () => {
      const duration = video.duration || 5;

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "center center", // When the center of the video hits the center of the screen
        end: "+=300%", // 300vh of scrubbing
        pin: true,     // Pin the video container
        scrub: true,
        onUpdate: (self) => {
          targetTimeRef.current = self.progress * duration;
        }
      });

      return trigger;
    };

    let trigger: ScrollTrigger | undefined;

    if (video.readyState >= 1) {
      trigger = setupScrollTrigger();
    } else {
      video.addEventListener("loadedmetadata", () => {
        trigger = setupScrollTrigger();
        ScrollTrigger.refresh();
      });
    }

    const updateVideo = () => {
      if (video) {
        const diff = targetTimeRef.current - video.currentTime;
        if (Math.abs(diff) > 0.02) {
          video.currentTime += diff * 0.1;
        }
      }
      animationFrameRef.current = requestAnimationFrame(updateVideo);
    };

    animationFrameRef.current = requestAnimationFrame(updateVideo);

    return () => {
      if (trigger) trigger.kill();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="divider divider-image animate-in-up"
      style={{ 
        position: "relative", 
        width: "100%", 
        paddingBottom: "60%", // Adjust aspect ratio for cinematic feel
        borderRadius: "var(--_radius-l)", 
        overflow: "hidden",
        backgroundColor: "#000"
      }}
    >
      <video
        ref={videoRef}
        src="img/backgrounds/bg_video_1.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1
        }}
      />
    </div>
  );
};
