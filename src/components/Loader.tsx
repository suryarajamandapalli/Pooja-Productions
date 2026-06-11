import React, { useEffect } from "react";
import gsap from "gsap";

export const Loader: React.FC = () => {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    // 1. Initialize logo states
    gsap.set(".loader__logo", { opacity: 0, scale: 0.75, filter: "blur(12px)" });
    gsap.set(".loader__flare", { opacity: 0, scale: 0 });
    gsap.set(".logo-shine", { left: "-150%" });

    // 2. Spawn and animate floating gold dust particles (organic slow drift)
    const particles = document.querySelectorAll(".gold-particle");
    particles.forEach((particle) => {
      const size = Math.random() * 5 + 3; // 3px to 8px
      const left = Math.random() * 100;   // percentage
      const top = Math.random() * 100;    // percentage
      const duration = Math.random() * 4 + 4; // 4s to 8s
      const delay = Math.random() * 2;

      gsap.set(particle, {
        width: size,
        height: size,
        left: `${left}%`,
        top: `${top}%`,
        opacity: 0,
      });

      // Drifting timeline for each particle
      gsap.timeline({ repeat: -1, delay: delay })
        .to(particle, {
          opacity: Math.random() * 0.7 + 0.3,
          duration: duration * 0.4,
          ease: "power1.out",
        })
        .to(particle, {
          y: -150 - Math.random() * 100,
          x: (Math.random() - 0.5) * 80,
          duration: duration,
          ease: "none",
        }, 0)
        .to(particle, {
          opacity: 0,
          duration: duration * 0.4,
          ease: "power1.in",
        }, duration * 0.6);
    });

    // 3. Cinematic Flare expands & flashes in (representing lens flare opening)
    tl.to(".loader__flare", {
      opacity: 1,
      scale: 1.8,
      duration: 1.2,
      ease: "power3.out",
    }, 0.2);

    // 4. Logo emerges from the flare, fading in and resolving blur
    tl.to(".loader__logo", {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.6,
      ease: "power2.out",
    }, 0.6);

    // 5. Flare softens & recedes
    tl.to(".loader__flare", {
      opacity: 0.25,
      scale: 1.1,
      duration: 1.4,
      ease: "power2.inOut",
    }, 1.2);

    // 6. Slow dolly camera zoom on the logo (cinematic pan)
    tl.to(".loader__logo", {
      scale: 1.05,
      duration: 2.0,
      ease: "sine.out",
    }, 1.6);

    // 7. Golden shine sweep runs across the logo
    tl.to(".logo-shine", {
      left: "150%",
      duration: 1.4,
      ease: "power2.inOut",
    }, 1.8);

    const doneTime = 3.4;

    // 8. Select page entry elements below the loader
    const loadingItems = document.querySelectorAll(".loading__item");
    const fadeInItems  = document.querySelectorAll(".loading__fade");

    gsap.set(loadingItems, { opacity: 0 });
    gsap.set(fadeInItems,  { opacity: 0 });

    // 9. Exit Animation: Logo does a rapid zoom into camera (dolly blur)
    tl.to(".loader__logo", {
      duration: 0.7,
      ease: "power3.in",
      opacity: 0,
      scale: 1.5,
      filter: "blur(18px)",
    }, doneTime);

    // 10. Flare expands rapidly and fades out
    tl.to(".loader__flare", {
      duration: 0.6,
      scale: 3,
      opacity: 0,
      ease: "power2.in",
    }, doneTime);

    // 11. Dissolve gold particles
    tl.to(".gold-particle", {
      opacity: 0,
      scale: 0,
      duration: 0.6,
      ease: "power2.in",
    }, doneTime);

    // 12. Pull loader curtain up (starts at doneTime + 0.3s)
    tl.to(".loader__wrapper", {
      duration: 0.9,
      ease: "power4.inOut",
      y: "-100%",
    }, doneTime + 0.3);

    // 13. Stagger headline items in (starts at doneTime + 0.7s)
    tl.to(loadingItems, {
      duration: 1.1,
      ease: "power4.out",
      startAt: { y: 120 },
      y: 0,
      opacity: 1,
      stagger: 0.05,
    }, doneTime + 0.7);

    // 14. Fade in fixed elements (logo, navigation, etc. starts at doneTime + 1.1s)
    tl.to(fadeInItems, {
      duration: 0.8,
      ease: "none",
      opacity: 1,
    }, doneTime + 1.1);

    // 15. Mark loader as loaded and disable pointer events
    tl.add(() => {
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("loaded");
    }, doneTime + 1.1);

    return () => { tl.kill(); };
  }, []);

  return (
    <div id="loader" className="loader">
      <div className="loader__wrapper">
        
        {/* Ambient Gold Backdrop & Particles */}
        <div className="loader__bg-effect">
          <div className="loader__particles">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="gold-particle" />
            ))}
          </div>
        </div>

        {/* Central Flare */}
        <div className="loader__flare"></div>

        {/* Brand Logo with Diagonal Shine */}
        <div className="loader__content" style={{ padding: "0 2rem" }}>
          <div className="logo-wrapper">
            <img
              src="/logo.png"
              alt="Pooja Productions Logo"
              className="loader__logo"
            />
            <div className="logo-shine" />
          </div>
        </div>

      </div>
    </div>
  );
};


