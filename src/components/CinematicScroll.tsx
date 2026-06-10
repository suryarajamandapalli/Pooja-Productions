import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CinematicScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    // We must wait for the video metadata to load to know the duration
    const setupScrollTrigger = () => {
      const duration = video.duration || 10; // fallback if NaN
      
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=400%", // 400vh of scrolling
        pin: true,     // Pin the entire container during scroll
        scrub: true,
        onUpdate: (self) => {
          // targetTime is percentage of video duration
          targetTimeRef.current = self.progress * duration;
        }
      });

      return trigger;
    };

    let trigger: ScrollTrigger | undefined;

    // Ensure video is ready before creating trigger
    if (video.readyState >= 1) {
      trigger = setupScrollTrigger();
    } else {
      video.addEventListener('loadedmetadata', () => {
        trigger = setupScrollTrigger();
        ScrollTrigger.refresh();
      });
    }

    // The interpolation loop for buttery smooth scrubbing
    const updateVideo = () => {
      if (video) {
        const diff = targetTimeRef.current - video.currentTime;
        // If the difference is extremely small, just snap it to prevent infinite micro-updates
        if (Math.abs(diff) > 0.01) {
          // Lerp factor: 0.1 for smoothness. Higher = more responsive, lower = smoother but laggy
          video.currentTime += diff * 0.1;
        }
      }
      animationFrameRef.current = requestAnimationFrame(updateVideo);
    };

    // Start loop
    animationFrameRef.current = requestAnimationFrame(updateVideo);

    return () => {
      if (trigger) trigger.kill();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Text Animations based on GSAP timelines
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create a timeline that scrubs along with the same container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=400%",
        scrub: 1,
      }
    });

    // Animate the text layers fading in and out sequentially
    tl.to('.cinematic-text-1', { opacity: 1, y: 0, duration: 1 })
      .to('.cinematic-text-1', { opacity: 0, y: -20, duration: 1, delay: 1 })
      
      .to('.cinematic-text-2', { opacity: 1, y: 0, duration: 1 })
      .to('.cinematic-text-2', { opacity: 0, y: -20, duration: 1, delay: 1 })
      
      .to('.cinematic-text-3', { opacity: 1, y: 0, duration: 1 })
      .to('.cinematic-text-3', { opacity: 0, y: -20, duration: 1, delay: 1 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="cinematic-scroll-section"
      style={{ position: 'relative', width: '100%', height: '400vh', backgroundColor: '#000' }}
    >
      {/* Pinned inner container */}
      <div 
        className="cinematic-sticky-wrapper" 
        style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}
      >
        {/* The Video */}
        <video
          ref={videoRef}
          src="img/backgrounds/introl_video_1.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1
          }}
        />

        {/* Dark vignette / overlay for luxury studio feel */}
        <div 
          className="cinematic-overlay"
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.9) 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Text Layers */}
        <div 
          className="cinematic-text-container"
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            pointerEvents: 'none',
            textAlign: 'center'
          }}
        >
          <div className="cinematic-text-1" style={{ position: 'absolute', opacity: 0, transform: 'translateY(20px)' }}>
            <h2 style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', textShadow: '0px 10px 30px rgba(0,0,0,0.8)' }}>
              The Vision
            </h2>
          </div>

          <div className="cinematic-text-2" style={{ position: 'absolute', opacity: 0, transform: 'translateY(20px)' }}>
            <h2 style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', textShadow: '0px 10px 30px rgba(0,0,0,0.8)' }}>
              The Process
            </h2>
          </div>

          <div className="cinematic-text-3" style={{ position: 'absolute', opacity: 0, transform: 'translateY(20px)' }}>
            <h2 style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', fontWeight: 200, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', textShadow: '0px 10px 30px rgba(0,0,0,0.8)' }}>
              The Legacy
            </h2>
          </div>
        </div>

      </div>
    </section>
  );
};
