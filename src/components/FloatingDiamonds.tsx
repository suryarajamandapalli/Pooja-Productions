import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const FloatingDiamonds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const diamonds = containerRef.current.querySelectorAll(".diamond-decoration");
    
    diamonds.forEach((diamond, index) => {
      // Subtle float animation
      gsap.to(diamond, {
        y: "+=30",
        x: index % 2 === 0 ? "+=10" : "-=10",
        rotation: "+=15",
        duration: 3 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: Math.random() * 2
      });

      // Parallax effect on scroll
      gsap.to(diamond, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5 + Math.random()
        },
        y: "-=150"
      });
    });
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Top section diamonds */}
      <img src="img/backgrounds/gold_diamond1.png" className="diamond-decoration" style={{ position: "absolute", top: "15%", left: "5%", width: "80px", opacity: 0.15, mixBlendMode: "screen", filter: "blur(2px)" }} alt="" />
      <img src="img/backgrounds/gold_diamond2.png" className="diamond-decoration" style={{ position: "absolute", top: "25%", right: "8%", width: "120px", opacity: 0.1, mixBlendMode: "screen" }} alt="" />
      
      {/* Middle section diamonds */}
      <img src="img/backgrounds/gold_diamond2.png" className="diamond-decoration" style={{ position: "absolute", top: "45%", left: "10%", width: "100px", opacity: 0.12, mixBlendMode: "screen" }} alt="" />
      <img src="img/backgrounds/gold_diamond1.png" className="diamond-decoration" style={{ position: "absolute", top: "55%", right: "5%", width: "90px", opacity: 0.15, mixBlendMode: "screen", filter: "blur(1px)" }} alt="" />

      {/* Bottom section diamonds */}
      <img src="img/backgrounds/gold_diamond1.png" className="diamond-decoration" style={{ position: "absolute", top: "75%", left: "7%", width: "110px", opacity: 0.1, mixBlendMode: "screen" }} alt="" />
      <img src="img/backgrounds/gold_diamond2.png" className="diamond-decoration" style={{ position: "absolute", top: "85%", right: "12%", width: "70px", opacity: 0.18, mixBlendMode: "screen", filter: "blur(2px)" }} alt="" />
    </div>
  );
};
