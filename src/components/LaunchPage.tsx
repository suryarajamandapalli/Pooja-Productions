/**
 * LaunchPage.tsx — Hollywood Theatre Curtain Reveal
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Architecture:
 *   [0] Homepage — fully loaded, interactive, underneath
 *   [1] Left/Right velvet curtain halves (cover 100% of screen)
 *   [2] Gold LAUNCH button centered on top
 *
 * Animation:
 *   - On click, curtains slide apart horizontally using GSAP (power4.inOut).
 *   - Once open, overlay is destroyed and scrolling is enabled.
 */

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [clicked, setClicked] = useState(false);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Lock scroll on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    const block = (e: Event) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(e.code)) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", blockKeys);
    };
  }, []);

  const handleLaunch = () => {
    if (clicked) return;
    setClicked(true);

    // Timeline for coordinated animation
    const tl = gsap.timeline({
      onComplete: () => {
        onLaunched();
      }
    });

    // 1. Fade/Scale button out
    tl.to(btnRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.out"
    });

    // 2. Wait 200ms, then slide curtains apart
    tl.to([leftCurtainRef.current, rightCurtainRef.current], {
      xPercent: (index) => (index === 0 ? -100 : 100),
      duration: 2.8,
      ease: "power4.inOut",
      delay: 0.2
    }, "-=0.2");
  };

  return (
    <div className="launch-stage">
      {/* Left Curtain */}
      <div ref={leftCurtainRef} className="curtain-half curtain-left">
        <img
          src="/img/velvet_curtains.jpg"
          alt="Theatre Curtain Left"
          className="curtain-img"
        />
        <div className="curtain-shading" />
      </div>

      {/* Right Curtain */}
      <div ref={rightCurtainRef} className="curtain-half curtain-right">
        <img
          src="/img/velvet_curtains.jpg"
          alt="Theatre Curtain Right"
          className="curtain-img"
        />
        <div className="curtain-shading" />
      </div>

      {/* Gold Launch Button */}
      {!clicked && (
        <div className="launch-btn-wrap">
          <button
            ref={btnRef}
            className="launch-btn"
            onClick={handleLaunch}
          >
            LAUNCH
          </button>
        </div>
      )}
    </div>
  );
};
