import React, { useEffect, useState } from "react";
import gsap from "gsap";

export const Loader: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obj = { value: 0 };
    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    // 1. Ultra-smooth count 0 → 100  (expo.inOut feels cinematic)
    tl.to(obj, {
      value: 100,
      duration: 2.6,
      ease: "expo.inOut",
      onUpdate: () => setCount(Math.floor(obj.value)),
    });

    // 2. Brief pause, then slide count down smoothly
    tl.to(".loader__count", {
      duration: 1.0,
      ease: "expo.in",
      y: "110%",
    }, "+=0.15");

    // 3. Smooth curtain pull: wrapper slides up (starts during count exit)
    tl.to(".loader__wrapper", {
      duration: 1.1,
      ease: "expo.inOut",
      y: "-100%",
    }, "-=0.55");

    // 4. Mark loader as done
    tl.add(() => {
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("loaded");
    });

    // 5. Hero elements blur + slide up in stagger sequence
    const loadingItems = document.querySelectorAll(".loading__item");
    const fadeInItems  = document.querySelectorAll(".loading__fade");

    gsap.set(loadingItems, { opacity: 0 });
    gsap.set(fadeInItems,  { opacity: 0 });

    tl.to(loadingItems, {
      duration: 1.4,
      ease: "expo.out",
      startAt: { y: 80, filter: "blur(18px)" },
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      stagger: 0.08,
    }, "-=0.65");

    // 6. Fade in nav + logo + color switcher
    tl.to(fadeInItems, {
      duration: 1.0,
      ease: "power2.out",
      opacity: 1,
    }, "-=0.5");

    return () => { tl.kill(); };
  }, []);

  return (
    <div id="loader" className="loader">
      <div className="loader__wrapper">
        <div className="loader__content">
          <div className="loader__count">
            <span className="count__text">{count}</span>
            <span className="count__percent">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
