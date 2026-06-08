import React, { useEffect, useState } from "react";
import gsap from "gsap";

export const Loader: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obj = { value: 0 };
    const tl = gsap.timeline();

    // 1. Smoothly animate the count value from 0 to 100 with a cinematic ease curve
    tl.to(obj, {
      value: 100,
      duration: 2.2, // 2.2 seconds smooth count-up
      ease: "power1.inOut",
      onUpdate: () => {
        setCount(Math.floor(obj.value));
      }
    });

    // 2. Pause briefly at 100% for readability, then slide the count text down out of view
    tl.to(".loader__count", {
      duration: 0.8,
      ease: "power2.in",
      y: "100%",
    }, "+=0.2");

    // 3. Slide the background wrapper up to expose the page (starts overlapping the count exit)
    tl.to(".loader__wrapper", {
      duration: 0.8,
      ease: "power4.in",
      y: "-100%",
    }, "-=0.4");

    // 4. Mark loader as loaded in DOM
    tl.add(() => {
      const loader = document.getElementById("loader");
      if (loader) {
        loader.classList.add("loaded");
      }
    });

    // 5. Query and stagger slide up the main hero elements
    const loadingItems = document.querySelectorAll(".loading__item");
    const fadeInItems = document.querySelectorAll(".loading__fade");

    gsap.set(loadingItems, { opacity: 0 });
    gsap.set(fadeInItems, { opacity: 0 });

    tl.to(loadingItems, {
      duration: 1.3,
      ease: "power4.out",
      startAt: { y: 100, filter: "blur(15px)" },
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      stagger: 0.06
    }, "-=0.6"); // starts sliding as wrapper transitions

    // 6. Fade in floating logo, navigation menu, and color switcher
    tl.to(fadeInItems, {
      duration: 0.8,
      ease: "none",
      opacity: 1,
    }, "-=0.4");

    return () => {
      tl.kill();
    };
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
