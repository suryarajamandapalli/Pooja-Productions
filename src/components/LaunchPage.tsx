import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./LaunchPage.css";

interface LaunchPageProps {
  onLaunched: () => void;
}

export const LaunchPage: React.FC<LaunchPageProps> = ({ onLaunched }) => {
  const [clicked, setClicked] = useState(false);
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

    // Set initial blurred and darkened state for the background site
    gsap.set(document.documentElement, {
      "--launch-blur": "20px",
      "--launch-brightness": "0.15"
    });

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, []);

  // Handle clicking the gold Launch switch button
  const handleLaunchClick = () => {
    if (clicked) return;
    setClicked(true);

    const leftStrips = document.querySelectorAll(".curtain-strip-l");
    const rightStrips = document.querySelectorAll(".curtain-strip-r");
    const shadows = document.querySelectorAll(".strip-shadow");

    // Initialize GSAP Timeline (curtains open over 5.2 seconds for a slow, heavy, realistic velvet feel)
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Destroy curtain layer and complete launch
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: onLaunched
        });
      }
    });

    // Left curtain strips (staggered starting from the center strip index 4 to leftmost index 0)
    tl.to(leftStrips, {
      xPercent: (i) => -100 * (i + 1) / 5, // pulls each strip left
      scaleX: 0.12,
      transformOrigin: "left center",
      duration: 5.2,
      ease: "power2.inOut",
      stagger: {
        amount: 0.9,
        from: "end"
      }
    }, 0);

    // Right curtain strips (staggered starting from the center strip index 0 to rightmost index 4)
    tl.to(rightStrips, {
      xPercent: (i) => 100 * (5 - i) / 5, // pulls each strip right
      scaleX: 0.12,
      transformOrigin: "right center",
      duration: 5.2,
      ease: "power2.inOut",
      stagger: {
        amount: 0.9,
        from: "start"
      }
    }, 0);

    // Shadows deepen in the folds to create a realistic 3D gathering effect
    tl.to(shadows, {
      opacity: 0.65,
      duration: 5.2,
      ease: "power2.inOut"
    }, 0);

    // Wait exactly 300ms after the click animation finishes before opening curtains
    setTimeout(() => {
      tl.play();

      // Synchronized reveal of the homepage container (unblur and brighten)
      gsap.to(document.documentElement, {
        "--launch-blur": "0px",
        "--launch-brightness": "1.0",
        duration: 4.8,
        ease: "power2.inOut",
        delay: 0.2
      });
    }, 300);
  };

  return (
    <div ref={containerRef} className="new-launch-container">
      {/* Volumetric spotlight rays behind curtains */}
      <div className="launch-aura"></div>
      <div className="launch-spotlight"></div>

      {/* Cinematic Curtains Layer (5 vertical strips on left, 5 on right) */}
      <div className="launch-curtains-stage">
        {/* Left Curtain */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`left-${i}`}
            className="curtain-strip curtain-strip-l"
            style={{
              left: `${i * 10}vw`,
              backgroundImage: "url(/img/velvet_curtains.jpg)",
              backgroundPosition: `-${i * 10}vw center`,
              backgroundSize: "100vw 100vh"
            }}
          >
            <div className="strip-shadow" />
          </div>
        ))}

        {/* Right Curtain */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`right-${i}`}
            className="curtain-strip curtain-strip-r"
            style={{
              left: `${(5 + i) * 10}vw`,
              backgroundImage: "url(/img/velvet_curtains.jpg)",
              backgroundPosition: `-${(5 + i) * 10}vw center`,
              backgroundSize: "100vw 100vh"
            }}
          >
            <div className="strip-shadow" />
          </div>
        ))}
      </div>

      {/* Centered Gold Theatre switch button */}
      <div className="launch-btn-wrapper">
        <button
          className={`launch-gold-ticket ${clicked ? "clicked" : ""}`}
          onClick={handleLaunchClick}
          disabled={clicked}
        >
          <div className="ticket-notch notch-l"></div>
          <div className="ticket-notch notch-r"></div>
          <div className="ticket-inner-border"></div>
          
          <div className="ticket-title">POOJA PRODUCTIONS</div>
          <span className="ticket-action">LAUNCH</span>
          <div className="ticket-meta">ADMIT ONE</div>
        </button>
      </div>
    </div>
  );
};
