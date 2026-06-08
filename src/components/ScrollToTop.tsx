import React, { useEffect, useState } from "react";
import gsap from "gsap";

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled past 20% of viewport height
      if (window.scrollY > window.innerHeight * 0.2) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Smooth scroll to top matching app.js duration and easing curves
    // We can also leverage Lenis or GSAP scrollTo
    gsap.to(window, {
      scrollTo: 0,
      ease: "power4.inOut",
      duration: 2,
    });
  };

  return (
    <a
      href="#0"
      id="to-top"
      className={`btn btn-to-top slide-up ${isVisible ? "visible" : ""}`}
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        visibility: isVisible ? "visible" : "hidden",
        transition: "opacity 0.8s ease, visibility 0.8s ease",
      }}
      onClick={handleClick}
    >
      <i className="ph ph-arrow-up"></i>
    </a>
  );
};
