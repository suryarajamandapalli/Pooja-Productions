import React, { useEffect, useState } from "react";
import gsap from "gsap";

export const Loader: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obj = { value: 0 };
    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

    // 1. Ultra-smooth count 0 → 100
    tl.to(obj, {
      value: 100,
      duration: 3.5,
      ease: "power3.inOut",
      onUpdate: () => setCount(Math.round(obj.value)),
    });

    const doneTime = 3.5;

    // 2. Select items to animate
    const loadingItems = document.querySelectorAll(".loading__item");
    const fadeInItems  = document.querySelectorAll(".loading__fade");

    gsap.set(loadingItems, { opacity: 0 });
    gsap.set(fadeInItems,  { opacity: 0 });

    // 3. Stagger headline items in (starts at doneTime + 0.8s)
    tl.to(loadingItems, {
      duration: 1.1,
      ease: "power4.out",
      startAt: { y: 120 },
      y: 0,
      opacity: 1,
      stagger: 0.05,
    }, doneTime + 0.8);

    // 4. Slide loader counter down (starts at doneTime + 1.8s)
    tl.to(".loader__count", {
      duration: 0.8,
      ease: "power2.in",
      y: "100%",
    }, doneTime + 1.8);

    // 5. Pull loader curtain up (starts at doneTime + 2.2s)
    tl.to(".loader__wrapper", {
      duration: 0.8,
      ease: "power4.in",
      y: "-100%",
    }, doneTime + 2.2);

    // 6. Fade in fixed elements (logo, navigation, etc. starts at doneTime + 3.2s)
    tl.to(fadeInItems, {
      duration: 0.8,
      ease: "none",
      opacity: 1,
    }, doneTime + 3.2);

    // 7. Mark loader as loaded (at doneTime + 3.2s)
    tl.add(() => {
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("loaded");
    }, doneTime + 3.2);

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
