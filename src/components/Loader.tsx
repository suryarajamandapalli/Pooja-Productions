import React, { useEffect } from "react";
import gsap from "gsap";

export const Loader: React.FC = () => {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    // 1. Fade in and scale up the logo
    tl.fromTo(
      ".loader__logo",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
    );

    // 2. Subtle pulse/breath effect
    tl.to(
      ".loader__logo",
      {
        scale: 1.04,
        opacity: 0.9,
        duration: 0.8,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      },
      1.0
    );

    const doneTime = 2.2;

    // 3. Select items to animate
    const loadingItems = document.querySelectorAll(".loading__item");
    const fadeInItems  = document.querySelectorAll(".loading__fade");

    gsap.set(loadingItems, { opacity: 0 });
    gsap.set(fadeInItems,  { opacity: 0 });

    // 4. Fade out logo (starts at doneTime)
    tl.to(".loader__logo", {
      duration: 0.5,
      ease: "power2.in",
      opacity: 0,
      scale: 1.1,
    }, doneTime);

    // 5. Pull loader curtain up (starts at doneTime + 0.2s)
    tl.to(".loader__wrapper", {
      duration: 0.8,
      ease: "power4.inOut",
      y: "-100%",
    }, doneTime + 0.2);

    // 6. Stagger headline items in (starts at doneTime + 0.5s)
    tl.to(loadingItems, {
      duration: 1.1,
      ease: "power4.out",
      startAt: { y: 120 },
      y: 0,
      opacity: 1,
      stagger: 0.05,
    }, doneTime + 0.5);

    // 7. Fade in fixed elements (logo, navigation, etc. starts at doneTime + 0.9s)
    tl.to(fadeInItems, {
      duration: 0.8,
      ease: "none",
      opacity: 1,
    }, doneTime + 0.9);

    // 8. Mark loader as loaded (at doneTime + 0.9s)
    tl.add(() => {
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("loaded");
    }, doneTime + 0.9);

    return () => { tl.kill(); };
  }, []);

  return (
    <div id="loader" className="loader">
      <div className="loader__wrapper">
        <div className="loader__content" style={{ padding: "0 2rem" }}>
          <img
            src="/logo.png"
            alt="Pooja Productions Logo"
            className="loader__logo"
          />
        </div>
      </div>
    </div>
  );
};

