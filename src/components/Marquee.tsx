import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number; // duration of one full cycle in seconds
}

export const Marquee: React.FC<MarqueeProps> = ({ children, speed = 20 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    // Duplicate children to create a seamless loop
    // In React, we can double the content inside the wrapper
    // but doing it dynamically in DOM is extremely robust for GSAP alignment
    const originalHTML = wrapper.innerHTML;
    wrapper.innerHTML = originalHTML + originalHTML;

    // Direction is from right to left (dirFromRight: "+=50%")
    // Let's create the marquee timeline
    const mod = gsap.utils.wrap(0, 50);
    const anim = gsap.to(wrapper, {
      duration: speed,
      ease: "none",
      x: "+=50%",
      modifiers: {
        x: (x) => {
          return (mod(parseFloat(x)) + "%");
        },
      },
      repeat: -1,
    });

    const master = gsap.timeline().add(anim, 0);

    const tween = gsap.to(master, {
      duration: 1.5,
      timeScale: 1,
      paused: true,
    });

    const timeScaleClamp = gsap.utils.clamp(1, 6);

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
        tween.invalidate().restart();
      },
    });

    return () => {
      anim.kill();
      master.kill();
      tween.kill();
      trigger.kill();
    };
  }, [speed]);

  return (
    <div ref={containerRef} className="items items--gsap">
      <div ref={wrapperRef} className="items__container">
        {children}
      </div>
    </div>
  );
};
