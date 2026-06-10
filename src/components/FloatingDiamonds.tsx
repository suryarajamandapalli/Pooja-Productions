import React, { useEffect } from "react";
import gsap from "gsap";

export const FloatingDiamonds: React.FC = () => {
  useEffect(() => {
    // Parallax and float animations for the diamonds
    gsap.to(".floating-diamond-left", {
      y: -100,
      rotation: 15,
      ease: "none",
      scrollTrigger: {
        trigger: ".main home", // or anything that scrolls past
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    gsap.to(".floating-diamond-right", {
      y: -150,
      rotation: -15,
      ease: "none",
      scrollTrigger: {
        trigger: ".main home",
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });
  }, []);

  return (
    <div className="floating-diamonds-container" style={{ position: "absolute", top: "120vh", left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}>
      {/* Left Diamond */}
      <img 
        src="/img/backgrounds/gold_diamond1.png" 
        alt="Gold Diamond" 
        className="floating-diamond-left"
        style={{ 
          position: "absolute", 
          left: "2%", 
          top: "10%", 
          width: "40px", 
          opacity: 0.6,
          filter: "drop-shadow(0 0 10px rgba(197, 168, 128, 0.4))"
        }} 
      />
      
      {/* Right Diamond */}
      <img 
        src="/img/backgrounds/gold_diamond2.png" 
        alt="Gold Diamond" 
        className="floating-diamond-right"
        style={{ 
          position: "absolute", 
          right: "3%", 
          top: "30%", 
          width: "60px", 
          opacity: 0.8,
          filter: "drop-shadow(0 0 15px rgba(197, 168, 128, 0.5))"
        }} 
      />
    </div>
  );
};
